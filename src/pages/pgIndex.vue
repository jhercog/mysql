<template>
  <q-page :style-fn="tweakHeight">
    <div class="column fit bg-brown-1">

      <div
        class="fit overflow-hidden flex items-center justify-center"
        ref="midContainer"
        :style="midStyle"
      >
        <div :style="gridStyle" class="row">
          <div
            v-for="(section, index) in sections"
            :key="'id_' + index"
            :style="cellStyle"
            class="col-8"
          >
            <q-btn
              class="fit"
              :color="section.color"
              :to="section.to"
              :type="section.href ? 'a' : 'button'"
              :href="section.href ? section.href : null"
              :target="section.href ? '_blank' : null"
              stack glossy ripple no-caps
            >
              <q-icon :size="iconSize" :name="section.icon" class="col-grow"/>
              <div class="col-shrink " style="line-height: 1rem">{{ section.label }}</div>
            </q-btn>
          </div>
        </div>
        <q-resize-observer @resize="onResize" />
      </div>

        <div class="absolute-top q-pa-md flex items-center justify-center text-brown" ref="topContainer">
          <q-card class="q-pa-xs" style="width: 100%">
          <div class="column justify-center ">
            <div class="flex text-h7 justify-center text-weight-bold text-brown-7">
              {{ getDate.datum }} <!-- <img :src="MoonPhase(2020,14,2)"> -->
            </div>
            <div class="flex text-caption justify-center">
              {{ getTodaysSaint.blagdan }}
            </div>
            <div class="flex justify-center">
              {{ getTodaysSaint.prazblag }}
            </div>
            <div class="flex justify-center">
              {{ getTodaysSaint.pomicni_blag }}
            </div>
            <div class="flex justify-center text-center text-weight-bold">
              {{ getTodaysSaint.sveci }}
            </div>
          </div>
        </q-card>
        </div>

      <!-- <q-card class="absolute-bottom q-pa-lg flex items-center justify-center" ref="bottomContainer"> -->
      <div class="absolute-bottom q-pa-md flex items-center justify-center" ref="bottomContainer">
        <q-card class="q-pa-xs" style="width: 100%">
        <div class="column text-center text-body1 text-brown">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        </q-card>
      </div>
    </div>
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
const sections = [
  { label: 'Kalendar', icon: 'mdi-calendar-month', color: 'indigo' , to: 'kalendar' },
  { label: 'Molitvenik', icon: 'mdi-book-open-outline', color: 'orange', to: 'molitvenik' },
  { label: 'Biblija online', icon: 'mdi-bookshelf', color: 'lime', href: 'https://biblija.ks.hr/' },
  { label: 'Časoslov', icon: 'mdi-timer-sand', color: 'pink', href: 'https://bozanskicasoslov.wordpress.com/' },
  { label: 'Praznici u RH', icon: 'mdi-calendar-heart', color: 'purple', to: 'blagdani' }
]
export default {
  data () {
    return {
      sections,
      midStyle: {},
      gridStyle: {},
      cellStyle: {},
      iconSize: null,
      mjeseci: null,
      svetacDana: null,
      persistent: false
    }
  },
  created () {
    this.getKalendar()
      .then(res => {
        this.mjeseci = groupBy(this.getKalendarObject, dan => dan.m)
      })
      .catch(error => {
        console.error(error)
      })
  },
  mounted () {
    this.onResize()
  },
  computed: {
    imgSrc () {
      return require('../assets/pozadina.jpg')
    },
    ...mapGetters('main', ['getIsOnline', 'getKalendarObject', 'getTodaysSaint', 'getKalMolVersionLocal']),
    getDate (){
      let datum = date.formatDate(Date.now(), 'dddd D.M.YYYY.')
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
  methods: {
    ...mapActions('main',['getKalendar']),
    ...mapMutations('main',['cleartateVars', 'setSuglasnostLS']),
    onResize () {
      console.log(this.$refs.topContainer);
      // const length = Math.min(this.$refs.midContainer.clientWidth, this.$refs.midContainer.clientHeight) / 16
      const topHeight = this.$refs.topContainer.clientHeight / 16
      const bottomHeight = this.$refs.bottomContainer.clientHeight / 16
      const midHeight = (this.$refs.midContainer.clientHeight / 16) - topHeight - bottomHeight
      const cellSize = ((midHeight - 1.5) / 3) * 0.9
      this.midStyle = {
        paddingTop: topHeight + 'rem',
        paddingBottom: bottomHeight + 'rem'
      }
      this.gridStyle = {
        width: (cellSize * 2 + 1 ) + 'rem'
      }
      this.cellStyle = {
        width: cellSize + 'rem',
        height: cellSize + 'rem',
        margin: '0.25rem'
      }
      this.iconSize = (cellSize / 3 ) + 'rem'
    },
    checkSuglasnost() {
      console.log('check suglasnost = ',this.getSuglasnostLS);
      if (this.getSuglasnostLS == 0) {
        this.persistent = true
      } else {
        this.persistent = false
      }
    },
    tweakHeight(offset) {
      console.log(offset)
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    },

    MoonPhase(yr_v, d_v, m_v) {
      // console.log(yr_v, d_v, m_v);
      // '    /*
      // '      calculates the moon phase (0-7), accurate To 1 segment.
      // '      0 = > new moon.
      // '      4 => full moon.
      // '      */

      let b
      let c
      let e //As Int
      let jd //As Double
      if(m_v < 3){
          yr_v=yr_v-1
          m_v = m_v+12
      }
      m_v=m_v+1
      c = 365.25*yr_v
      e = 30.6*m_v
      jd = c+e+d_v-694039.09  /* jd Is total days elapsed */
      jd = jd/29.53           /* divide by the moon cycle (29.53 days) */
      b=Math.floor(jd)//'    b = jd		   /* Int(jd) -> b, take integer part of jd */
      jd = jd - b		  /* subtract integer part To leave fractional part of original jd */
      b = jd*8 + 0.5	   /* scale fraction from 0-8 AND Round by adding 0.5 */
      b =   b & 7		  //'' /* 0 AND 8 are the same so turn 8 into 0 */
      // return b
        let moonImg
        switch (b) {
          case 0: moonImg = 'statics/moon0-40.png'; break
          case 1: moonImg = 'statics/moon1-40.png'; break
          case 2: moonImg = 'statics/moon2-40.png'; break
          case 3: moonImg = 'statics/moon3-40.png'; break
          case 4: moonImg = 'statics/moon4-40.png'; break
          case 5: moonImg = 'statics/moon5-40.png'; break
          case 6: moonImg = 'statics/moon6-40.png';console.log('moonImg'); break
          case 7: moonImg = 'statics/moon7-40.png'; break
          // default: moonImg = '';
        }
        return moonImg
    }
  }
}
</script>
