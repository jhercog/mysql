<template>
  <q-page :style-fn="tweakHeight">
    <div class="column fit bg-brown-1">

      <div
        class="fit overflow-hidden flex items-center column q-pa-md"
        ref="midContainer"
        :style="midStyle"
      >
        <div
          v-for="(section, index) in sections"
          :key="'id_' + index"
          class="col full-width"
          :class="{
            'q-pb-xs': index < sections.length - 1,
            'q-pb-none': index === sections.length - 1
          }"
        >
          <q-btn
            :color="section.color"
            :to="section.to"
            :type="section.href ? 'a' : 'button'"
            :href="section.href ? section.href : null"
            :target="section.href ? '_blank' : null"
            class="fit main-menu-btn"
            align="left"
            ripple no-caps
          >
            <q-icon :size="iconSize" :name="section.icon" :style="{ width: iconWidth }"/>
            <div
              class="q-px-sm"
              :style="{
                fontSize: $q.screen.lt.sm ? '0.875rem' : '1.25rem',
                fontWeight: '700'
              }"
            >
              {{ section.label }}
            </div>
            <q-space/>
            <q-icon size="xs" name="mdi-arrow-right" class="q-mr-sm" />
          </q-btn>
        </div>
        <q-resize-observer @resize="onResize" />
      </div>


      <div class="absolute-top q-px-md q-pt-md q-pb-xs flex items-center justify-center text-brown" ref="topContainer">
        <q-card class="q-py-sm q-px-sm" style="width: 100%">
          <div class="row day no-wrap" :class="getDayClasses">
            <q-card flat bordered class="day-icon" ref="dayIcon">
              <q-card-section class="day-in-week">{{ dayOfWeek.toUpperCase() }}</q-card-section>
              <q-card-section class="date">{{ getToday.d }}.{{ getToday.m }}</q-card-section>
              <q-card-section class="year">{{ getToday.y }}</q-card-section>
            </q-card>
            <div class="column text-brown justify-center q-px-sm">
              <div class="flex">{{ getTodaysData.prazblag }}</div>
              <div class="flex">{{ getTodaysData.pomicni_blag }}</div>
              <div class="flex">{{ getTodaysData.sveci }}</div>
              <div class="flex text-caption">{{ getTodaysData.blagdan }}</div>
            </div>
            <q-space/>
            <div class="flex">
              <q-icon size="xs" :class="getMoonClass({ day: parseInt(getToday.d), month: parseInt(getToday.m), year: parseInt(getToday.y) })" />
            </div>
          </div>
        </q-card>
        <q-resize-observer @resize="onResize" />
      </div>

      <!-- <q-card class="absolute-bottom q-pa-lg flex items-center justify-center" ref="bottomContainer"> -->
      <div class="absolute-bottom q-px-md q-pt-xs q-pb-md flex items-center justify-center" ref="bottomContainer">
        <q-card class="q-pa-sm" style="width: 100%">
          <div class="row items-center">
            <q-icon :size="iconSize" name="mdi-comment-quote-outline" color="brown-2" :style="{ width: iconWidth }"/>
            <div class="col text-brown flex items-center q-px-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
        </q-card>
        <q-resize-observer @resize="onResize" />

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
      iconWidth: null,
      mjeseci: null,
      svetacDana: null,
      persistent: false
    }
  },
  async created () {
    this.getKalendar()
      .then(res => {
        this.mjeseci = groupBy(this.getKalendarObject, dan => dan.m)
      })
      .catch(error => {
        console.error(error)
      })
    this.$q.screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 })
  },
  mounted () {
    this.onResize()
  },
  computed: {
    ...mapGetters('main', ['getToday', 'getMoonClass', 'getIsOnline', 'getKalendarObject', 'getTodaysData', 'getKalMolVersionLocal']),
    imgSrc () {
      return require('../assets/pozadina.jpg')
    },
    getDate () {
      return date.formatDate(Date.now(), 'dddd D.M.YYYY.')
    },
    dayOfWeek () {
      const danDate = new Date(this.getToday.y, this.getToday.m - 1, this.getToday.d)
      return date.formatDate(danDate, 'ddd')
    },
    isHoliday () { return !parseInt(this.getTodaysData.radniDan) },
    isSunday () { return this.dayOfWeek === 'Ned' },
    getDayClasses () {
      let classes = []
      if (!this.isSunday && !this.isHoliday) classes.push('is-workingday')
      if (this.isSunday) classes.push('is-sunday')
      if (this.isHoliday) classes.push('is-holiday')
      return classes
    }
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
      const iconWidth = (this.$refs.dayIcon.$el.clientWidth / 16)
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
      this.iconWidth = iconWidth + 'rem'
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
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    }
  }
}
</script>
