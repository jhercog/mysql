<template>
  <q-page class="q-pa-sm">
    <q-btn label="Home"
      to="/"
      outline
      rounded
      color="green-5" />

      <q-btn label="ExpansionToggle"
        outline
        rounded
        @click="show = true"
        clickable
        color="blue-5" />
    <br>


    <!-- <q-list bordered separator>
      <q-item clickable v-ripple v-if="nadji == 'xx'">
        <q-item-section>Single line item</q-item-section>
      </q-item>

      <q-item clickable v-ripple v-if="nadji">
        <q-item-section>
          <q-item-label>Item with caption</q-item-label>
          <q-item-label caption>Caption</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple v-if="nadji">
        <q-item-section>
          <q-item-label overline>OVERLINE</q-item-label>
          <q-item-label>Item with caption</q-item-label>
        </q-item-section>
      </q-item>
    </q-list> -->


    <!-- {{ kategorije }} -->
    <div class="row bg-yellow q-pa-md">
      MOLITVENIK
    </div>
    <q-input borderless dense debounce="300" color="primary"
    v-model="searchText"
    placeholder = "Pretraži molitvenik..." >
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-input>
<!-- <div v-if="items">
  <ul>
    <li v-for="item in filteredMolitve">{{ item.naziv }} </li>
  </ul>
</div> -->







<!-- v-if="kategorije" -->
    <!-- <div
      class="q-pa-md" style="">

    <q-list bordered class="rounded-borders">
        <q-expansion-item
          v-for="(kategorija, index) in kategorije" :key="'id_' + index"
          :content-inset-level="0.5" expand-separator
          :label="index">
            <q-list bordered class="rounded-borders"
              v-for="molitva in kategorija" :key="molitva.id">
              <q-item clickable
                @click="showMolitva = true, kategorijeData(molitva.id )">
                <q-item-section
                  @click="showMolitva = true">
                   {{molitva.id}} {{ molitva.naziv }}
                </q-item-section>
              </q-item>
            </q-list>
        </q-expansion-item>
      </q-list>
    </div> -->

<!-- :default-opened="!searchText == ''" -->
    <q-list bordered class="rounded-borders">
        <q-expansion-item v-model="show" ref="expItem"
          v-for="(kategorija, index) in kategorije" :key="'id_' + index"
          :content-inset-level="0.5" expand-separator
          :label="index">


          <q-list bordered class="rounded-borders" v-if="items" ref="list">
            <q-item clickable v-for="item in filteredMolitve" :key="item.id"
              @click="showMolitva = true, kategorijeData(item.id )">
              <q-item-section
                @click="showMolitva = true">
                  {{ item.naziv }}
              </q-item-section>
            </q-item>
          </q-list>

      </q-expansion-item>
    </q-list>

<!-- ************************************************************************* -->
    <q-dialog v-model="showMolitva">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="statics/katkalikona.png">
          </q-avatar>

          <!-- <q-toolbar-title><span class="text-weight-bold">{{getMolitvenikObject[molitvaID-1].naziv}}</span></q-toolbar-title> -->
          <q-toolbar-title><span class="text-weight-bold">{{ getMolitvenikObject[molitvaID-1] ? getMolitvenikObject[molitvaID-1].naziv : null}}</span></q-toolbar-title>

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
import { mapGetters, mapActions, mapMutations } from 'vuex'

 export default {
   data () {
     return {
       kategorije: null,
       kategorija: '',
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
}
   },
   mounted () {
     // this.fetchMolitvenik()
   },
   computed: {
     ...mapGetters('main', ['getIsOnline', 'getMolitvenikObject']),

     itemsSearched : function(){
        var self = this;
        if( this.searchText == ''){
          return this.items;
        }
        return this.items.filter(function(item){
          return item.naziv.indexOf(self.searchText) >= 0;
        });
      },

      filteredMolitve: function(){
        // const searchTerm = this.searchText.toUpperCase();

        return this.items.filter((item) => {
          return item.naziv.toLowerCase().match(this.searchText.toLowerCase());
          this.showE()
          // this.show = true;
          // return user.name.toLowerCase().match(this.searchInput.toLowerCase());
        });
      }

//       You can also use String#test, which accepts a regex with the insensitive (i) flag, and returns true if the string matches the expression, or false if not:
// const searchTerm = this.search_by_name.toLowerCase();
      // const searchTerm = new RegExp(this.search_by_name, 'i');
      // const searchEvent = new RegExp(this.search_by_event_type, 'i');
      //
      // this.model.filter((item) =>
      //   searchTerm.test(item.clients_association) &&
      //   searchEvent.test(item.event_type)
      // );


   },

   filters: {

   //searchFilter: function(item) {
   //  return item.charAt(0) == this.searchText;
  // }

},
   created () {

// window.scrollTo(0,document.body.scrollHeight)

 // window.scrollTo(300, 0)

     this.getKalendar()
        .then(res => {
      this.kategorije = groupBy(this.getMolitvenikObject, molitva => molitva.kategorija)
      console.log('LocalStorage EMPTY stranica getter?  ', this.$q.localStorage.isEmpty())
      this.items = this.getMolitvenikObject
        })
        .catch(error => {
           console.error(error)
         })
       },
   methods: {
     ...mapActions('main',['getKalendar']),
     ...mapMutations('main',['clearStateVars']),

     showExpItem() {
         this.$refs.expItem.show()
         console.log('ccccc');
         console.log(this.$refs.expItem);
      },

      showE() {
          this.show = true
       },
      clearStorage (){
        this.$q.localStorage.clear()
        this.clearStateVars()
      },

      kategorijeData (molID){
        this.molitvaID = molID
        console.log(this.molitvaID);
      },
      //
      // getMolitva (val){
      // },
    },
 }
</script>
<!-- console.log(this.molitve);
console.log(response); -->
