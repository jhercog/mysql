<template>
  <q-page class="q-pa-sm "
    style=""
    :style="{'background-image': 'url('+imgSrc+')', backgroundSize: 'cover'}"
    >
    <!-- :style="{'background-image': 'url(' + require('~assets/pozadina.jpg') + ')'}" -->
    <!-- <q-img src="statics/pozadina.jpg" /> -->

    <div class=" "
      style="padding: 0px;width: 100%"
      :style="{backgroundImage: imgSrc}">

    <div class="column flex-center items-start q-gutter-md "
      style="padding: 0px;width: 100%">
      <q-card class="my-card">
        <q-img src="statics/sv-obitelj.jpg">
          <div class="absolute-bottom text-subtitle2 text-center">
          {{ getDate.datum }}, {{ getKalMolVersionLocal.ver_kal }}, {{ getKalMolVersionLocal.ver_mol }}
          <br>
           {{ getTodaysSaint }}
          </div>
        </q-img>
      </q-card>
    </div>


    <div class="column flex-center items-start  q-gutter-md "
      >
      <!-- :style="{'background-image': 'url('+imgSrc+')'}" -->
      <!-- :style="{background-image: url(imgSrc), backgroundSize: 'cover'}" -->
      <!-- <div :style="{'background-image': 'url(' + require('../assets/pozadina.jpg') + ')'}"> -->
      <!-- :style="{'background-image': 'url(' + require('../assets/pozadina.jpg') + ')'}" -->

      <!-- :style="{background-image: imgSrc, backgroundSize: 'cover'}" -->
      <!-- <q-img src="/assets/pozadina.jpg" /> -->
      <!-- <img src="~assets/pozadina.jpg" /> -->
      <!-- <q-card class="my-card "> -->
        <!-- <q-card-actions vertical align="center"> -->
        <!-- <div class="absolute-top  text-center"> -->
        <br>
        <br>
          <q-btn label="KALENDAR" class="btns"
            to="kalendar"
            outline
            rounded
            color="brown-5" />
          <br>
          <q-btn label="MOLITVENIK" class="btns"
            to="molitvenik"
            outline
            rounded
            color="brown-5" />
          <br>
          <q-btn label="BIBLIJA ON-LINE (KS)" class="btns"
            type="a"
            href="https://biblija.ks.hr/"
            outline
            clickable
            rounded
            color="brown-5" />
          <br>
          <q-btn label="ČASOSLOV" class="btns"
            type="a"
            target="_blank"
            href="https://bozanskicasoslov.wordpress.com/"
            outline
            clickable
            rounded
            color="brown-5" />
            <br>
          <q-btn label="PRAZNICI I BLAGHANI U RH" class="btns"
            to="BLAGDANI"
            outline
            clickable
            rounded
            color="brown-5" />
            <br>


            <!-- <q-btn label="Suglasnost"
              clickable
              @click="checkSuglasnost()"
              outline
              rounded
              color="red-5" />

              <q-btn label="Suglasnost LS"
                clickable
                @click="setSuglasnostLS()"
                outline
                rounded
                color="red-5" /> -->

          <!-- </div> -->
        <!-- </q-img> -->
        <!-- </q-card-actions> -->
      <!-- </q-card> -->
    </div>

  </div>
  <!-- <div    :style="{ color: dayOfWeek(dan.id)=='ned' ? 'red' : 'green'}"> -->
  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-teal text-white" style="width: 300px">
          <q-card-section>
            <div class="text-h6">Suglasnost i informacije o verziji</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Instalacijom Katoličkog kalendara i molitvenika prihvaćate Politiku privatnosti do koje možete doći klikom na link u Izborniku.
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup @click="setSuglasnostLS()"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
  </q-page>
</template>
  <style lang="sass" scoped>
    .my-card
      width: 100%
      height: 100%
      //max-width: 400px

    .btns
      width: 80%
      max-width: 400px

    .bg-img

  </style>
<script>
import { date } from 'quasar'
import { groupBy } from 'lodash'
import axios from 'axios'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { openURL } from 'quasar'

 export default {
   data () {
     return {
        mjeseci: null,
        svetacDana: null,
        persistent: false
      }
   },
   mounted () {
     // this.checkSuglasnost()

   },
   computed: {

      imgSrc () {
        return require('../assets/pozadina.jpg')
      },
      ...mapGetters('main', ['getIsOnline', 'getKalendarObject', 'getTodaysSaint', 'getKalMolVersionLocal']),

      getDate (){
       let datum = date.formatDate(Date.now(), 'D.M.YYYY.')
       let newDate = new Date()
       let d = newDate.getDate() // `day` is 4
       let m = newDate.getMonth() + 1// `day` is 4
       let y = newDate.getFullYear() // `day` is 4

       return {
         datum: datum,
         d: d,
         m: m,
         y: y,
       }
     },
   },
   created () {
     this.getKalendar()
        .then(res => {
      this.mjeseci = groupBy(this.getKalendarObject, dan => dan.m)
      // console.log('LocalStorage EMPTY stranica getter?  ', this.$q.localStorage.isEmpty())
        })
        .catch(error => {
           console.error(error)
         })
       },
   methods: {
     ...mapActions('main',['getKalendar']),
     ...mapMutations('main',['clearStateVars', 'setSuglasnostLS']),

     checkSuglasnost() {
       console.log('check suglasnost = ',this.getSuglasnostLS);
       if (this.getSuglasnostLS == 0) {
         this.persistent = true
       }else{
         this.persistent = false
       }
     },
   }
 }
</script>
