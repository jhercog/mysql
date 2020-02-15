<template>
  <q-page class="q-pa-sm">

    <q-input outlined
      clearable
      clear-icon="close"
      dense debounce="300" color="primary"
      v-model="searchText" @input="showE()"
      placeholder = "Pretraži molitvenik..." >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
  <br>
    <q-list bordered class="rounded-borders">
      <!-- v-if="index == 'Litanije' || index == 'Osnovne molitve'"  RADI  -->
        <q-expansion-item  ref="expItem"
          v-model="show"
          v-for="(kategorija, index) in kategorije" :key="'id_' + index"
          :content-inset-level="0.5" expand-separator
          :label="index"
          >
          <!-- :label="index" -->
          <q-list bordered class="rounded-borders" v-if="items" ref="list">
            <q-item clickable v-for="item in filteredMolitve" :key="item.id"
            @click="showMolitva = true, kategorijeData(item.id )"
            v-if="item.naziv && item.kategorija == index">
              <q-item-section
                @click="showMolitva = true">
                  {{ item.naziv }}
              </q-item-section>
            </q-item>
          </q-list>

      </q-expansion-item>
    </q-list>

    <q-dialog v-model="showMolitva">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="statics/katkalikona.png">
          </q-avatar>
          <q-toolbar-title><span class="text-weight-bold">{{ getMolitvenikObject[molitvaID-1] ? getMolitvenikObject[molitvaID-1].naziv : null}}</span></q-toolbar-title>
          <q-btn @click="favoriteAdd()" flat round dense :icon="favorites.includes(molitvaID) ? 'star' : 'star_border'" />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section
          >
          <pre>
          {{ getMolitvenikObject[molitvaID-1] ? getMolitvenikObject[molitvaID-1].molitva : null}}
          </pre>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDialog" bottom full-height>
      <div class="q-pa-md bg-white" style="max-width: 400px;min-width: 200px">
        <q-toolbar>
          <q-toolbar-title><span class="text-weight-bold">Omiljene molitve</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <br>
        <q-list bordered class="rounded-borders" >
          <q-item  v-for="favorite in favorites" :key="favorite" clickable   @click="showMolitva = true, molitvaID = favorite">
            <q-item-section >
              <q-item-label overline>{{ getMolitvenikObject[favorite-1].naziv }}</q-item-label>
              <!-- <q-item-label overline>{{ item.pomicni_blag }}</q-item-label>
              <q-item-label overline>{{ item.sveci }}</q-item-label> -->
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-dialog>


  </q-page>
</template>
<style media="screen">
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
  }
</style>
<script>
import { groupBy } from 'lodash'
import axios from 'axios'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      kategorije: null,
      kategorija: '',
      kategorijaF: '',
      kat_index: null,
      molitvenik: null,
      value: null,
      showMolitva: false,
      molitvaID: null,
      searchText: '',
      nadji: 'xx',
      // items: null,
      items: null,
      show: false,
      test: null,
      favorites: []
    }
  },
  created () {
    this.getKalendar()
      .then(res => {
        this.kategorije = groupBy(this.getMolitvenikObject, molitva => molitva.kategorija)
        console.log('LocalStorage EMPTY stranica getter?  ', this.$q.localStorage.isEmpty())
        this.items = this.getMolitvenikObject //ovo radi
        // this.items = groupBy(this.getMolitvenikObject, molitva => molitva.kategorija)
      })
      .catch(error => {
        console.error(error)
      })
  },
  mounted () {
    let LS = JSON.parse(this.$q.localStorage.getItem('userSettings'))
    this.favorites = LS[1].value

  },
  computed: {
    ...mapGetters('main', ['getIsOnline', 'getMolitvenikObject']),
    showDialog: {
      get () {
        return this.$store.getters['main/getShowDialog']
      },
      set (val) {
        console.log(val)
        this.$store.commit('main/setShowDialog', val)
      }
    },
    filteredMolitve () {
      if( this.searchText == ''){
        return this.items
      }
      return this.items.filter((item) => {
        if (this.searchText == null) {
          this.searchText = ''
        }
        return item.naziv.toLowerCase().match(this.searchText.toLowerCase())
      })
    },
    filteredKat () {
      return this.items.filter((item) => {
        return item.kategorija.toLowerCase().match(this.searchText.toLowerCase())
      })
    },
  },
  methods: {
    ...mapActions('main',['getKalendar']),
    ...mapMutations('main',['clearStateVars']),

    favoriteAdd() {
      let LS = JSON.parse(this.$q.localStorage.getItem('userSettings'))

      // console.log('--------------setting1',LS[0]);
      // console.log('--------------favorites',LS[1]);
      // console.log('--------------noviArray',LS[1].value.push(3,2));
      // console.log('--------------favorites',LS[1]);
      // this.$q.localStorage.set('userSettings',JSON.stringify([LS[0],LS[1]]))
      // console.log('+++++++++++novi LS: ',JSON.parse(this.$q.localStorage.getItem('userSettings')));

      console.log('molitvaID: ',this.molitvaID)
      // console.log(this)
      if (!LS[1].value.includes(this.molitvaID)) {
        LS[1].value.push(this.molitvaID);
        this.favorites = LS[1].value
        this.$q.localStorage.set('userSettings',JSON.stringify([LS[0],LS[1]]))
        // this.$q.localStorage.clear()
        // console.log('molitvaID: ',this.molitvaID);
        console.log('favorites array: ',JSON.parse(this.$q.localStorage.getItem('userSettings')));
      } else {
        // this.favorites.filter(function(e) { return e !== 'this.molitvaID' })
        LS[1].value = _.without(LS[1].value, this.molitvaID)
        this.favorites = LS[1].value
        this.$q.localStorage.set('userSettings',JSON.stringify([LS[0],LS[1]]))
        console.log('favorites array: ',JSON.parse(this.$q.localStorage.getItem('userSettings')));
      }
      // console.log('includes poslije: ',this.favorites.includes(this.molitvaID));
    },
    showExpItem() {
        this.$refs.expItem.show()
        console.log('ccccc');
        console.log(this.$refs.expItem);
    },
    showE() {
    this.show = true
    },
    testKat(){
      this.test = groupBy(this.filteredMolitve, molit => molit.kategorija)
    },
    shItemsKat(){
      this.items = groupBy(this.filteredMolitve, molit => molit.kategorija)
    },
    setMolitvaID() {
      // this.molitvaID =
    },
    clearStorage (){
      this.$q.localStorage.clear()
      this.clearStateVars()
    },
    kategorijeData (molID){
      this.molitvaID = molID
      console.log(this.molitvaID);
    }
  },
}
</script>
