<template>
<q-page :style-fn="tweakHeight">
  <!-- v-touch-swipe.mouse.left.right="handleSwipe" -->

  <!-- +++++++++++++++++++++++++++++++++++++++++ -->
  <!-- @click="scrollToElement($refs.xxx)" -->
  <!-- <q-btn label="Calendar"
      clickable
      @click="createEvent()"
      outline
      rounded
      color="green-5" />
    <br> -->
  <q-tab-panels v-model="currentMonth" animated swipeable transition-prev="slide-right" transition-next="slide-left" class="fit" :style="{ paddingTop: `${pageHeaderHeight}px` }">
    <!-- <q-tab-panel
      v-for="(mjesec, indM) in croDates.months"
      :key="'m_' + (indM + 1)"
      :name="(indM + 1).toString()"
      :class="'m_' + (indM + 1)"
    > -->
    <q-tab-panel
      v-for="(mjesec, mjesecKey, mjesecIndex) in mjeseci"
      :key="mjesecKey"
      :name="mjesecIndex + 1"
      class="q-pa-none"
    >
      <q-scroll-area class="fit">
        <q-list class="q-py-sm bg-grey-1" ref="lista">
          <q-item
            v-for="(dan, danKey, danIndex) in mjesec"
            :key="danKey"
            :ref="'day_' + danKey"
            :id="'day_' + danKey"
            clickable ripple
            class="day"
            :class="getDayClasses(dan)"
            @click="showDay(dan)"
          >
            <q-item-section side>
              <q-card flat bordered class="day-icon">
                <q-card-section class="day-in-week">
                  {{ dayOfWeek2(dan).toUpperCase() }}
                </q-card-section>
                <q-card-section class="date">
                  {{ dan.d }}.{{ dan.m }}.
                </q-card-section>
              </q-card>
            </q-item-section>

            <q-item-section>
              <q-item-label v-if="dan.pomicni_blag" class="title">{{ dan.pomicni_blag }}</q-item-label>
              <q-item-label class="body">{{ dan.sveci }}</q-item-label>
              <q-item-label class="caption" caption lines="2">{{ dan.blagdan }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div :class="'bg-' + getColor(dan.boja)[0]" style="width: 0.75rem; height: 0.75rem; border-radius: 0.375rem; border-style:solid; border-width:1px;" />
              <div v-if="getColor(dan.boja)[0]=='pink-3'" :class="'bg-purple'" style="width: 0.75rem; height: 0.75rem; border-radius: 0.375rem; border-style:solid; border-width:1px;" />
            </q-item-section>
            <q-item-section side>
              <!-- {{dan.m}} -->
              <!-- <div :class="'bg-' + getColor(dan.boja)[0]" style="width: 0.75rem; height: 0.75rem; border-radius: 0.375rem; border-style:solid; border-width:1px;" /> -->
              <!-- <q-avatar size="xs" color="brown">
                <img :src="MoonPhase(today.y,dan.d,dan.m)">
              </q-avatar> -->
              <q-icon class="wi wi-moon-new" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-tab-panel>
  </q-tab-panels>

  <div ref="pageHeader" class="absolute-top">
    <div>
      <div v-if="checkNextYear" class="row justify-center q-py-md">
        <q-btn flat v-if="checkNextYear" rounded color="brown" size="1rem" :label="today.y" @click="chosenYear = today.y"/>
        <q-btn v-if="checkNextYear" flat rounded color="brown" size="1rem" :label="today.y + 1" @click="chosenYear = today.y + 1" />
      </div>
      <q-tabs v-model="currentMonth" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab
          v-for="(mjesec, index) in croDates.monthsShort"
          :key="(index + 1).toString()"
          :name="index + 1"
          :label="mjesec"
        />
      </q-tabs>
    </div>
    <q-separator />
    <div class="text-h6 text-center bg-brown-1 flex items-center justify-center" style="height: 50px">{{ croDates.months[currentMonth - 1].toUpperCase() }}</div>
    <q-separator />
  </div>
  <!-- </q-tabs> -->
  <!-- +++++++++++++++++++++++++ -->


  <q-dialog v-model="dayDetails">
    <q-card>
      <q-toolbar
        :class="{
          'bg-red-10': dayOfWeek2(chosenDay) === 'Ned' && chosenDay.d !== today.d.toString(),
          'bg-brown-5': dayOfWeek2(chosenDay) !== 'Ned' && chosenDay.d !== today.d.toString(),
          'bg-blue': chosenDay.d === today.d.toString()
        }"
      >
        <q-avatar color="white">
          <img src="statics/katkalikona.png">
        </q-avatar>
        <q-toolbar-title class="text-white">
          <span class="text-weight-bold">{{ dayOfWeek2(chosenDay) }}, </span>{{ chosenDay.d }}.{{ currentMonth }}.{{ today.y }}.
        </q-toolbar-title>
        <q-avatar size="xs" color="brown">
          <img :src="MoonPhase(today.y,chosenDay.d,chosenDay.m)">
        </q-avatar>
        <q-btn flat round dense color="white" icon="close" v-close-popup />
      </q-toolbar>

      <q-btn
        v-if="$q.platform.is.mobile"
        color="secondary"
        label="Podsjetnik"
        @click="createEvent(2020, currentMonth, chosenDay.d, mjeseci[currentMonth] ? mjeseci[currentMonth][chosenDay.d - 1].sveci : null)"
      />

      <q-card-section>
        <q-card bordered flat class="bg-brown-1">
          <q-card-section class="flex items-center">
            <div class="text-h6">Sveci</div>
            <q-space />
            <q-chip :color="getColor(this.chosenDay.boja)[0]" :text-color="getColor(this.chosenDay.boja)[2]">
              {{ this.chosenDay.boja }}
            </q-chip>
            <q-chip v-if="getColor(this.chosenDay.boja)[0]=='pink-3'" :color="'purple'" :text-color="getColor(this.chosenDay.boja)[2]">
              {{ this.chosenDay.boja }}
          </q-chip>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="text-subtitle1">
            <div class="">
              {{ getSaints }}
            </div>
          </q-card-section>
        </q-card>
        <br>
        <q-card bordered flat class="bg-brown-1" type="a" href="https://biblija.ks.hr/">
          <q-card-section class="flex items-center">
            <div class="text-h6">Čitanja</div>
            <q-space />
            <q-avatar icon="book" />
          </q-card-section>
          <q-separator inset />
          <q-card-section class="text-subtitle1" clickable @click="openHilp(chosenDay.d, currentMonth)">
            {{ getReadings }}<br>
          </q-card-section>
        </q-card>

      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showDialog" bottom full-height>
    <div class="q-pa-md bg-white" style="max-width: 350px">
      <q-toolbar>
        <q-toolbar-title><span class="text-weight-bold">Pretraživanje kalendara</span></q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-input outlined dense debounce="300" color="primary" autofocus
        clearable
        clear-icon="close"
        v-model="searchText"
        placeholder = "Pretraži kalendar..." >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <br>
      <q-list bordered class="rounded-borders" v-if="items">
        <q-item  v-for="item in filteredSveci" :key="item.id">
          <q-item-section>
            <q-item-label overline>{{ item.d }}.{{ item.m }}.</q-item-label>
            <q-item-label overline>{{ item.pomicni_blag }}</q-item-label>
            <q-item-label overline>{{ item.sveci }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-dialog>
</q-page>
</template>
<script>
import { date } from 'quasar'
import { groupBy } from 'lodash'
import axios from 'axios'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
const now = new Date()
const today = {
  datum: date.formatDate(now, 'D.M.YYYY.'),
  d: now.getDate(),
  m: now.getMonth() + 1,
  y: now.getFullYear()
}
export default {
  data() {
    return {
      croDates: this.$q.lang.date, // Ovo je date objekt localea koji smo postavili u App.vue
      today,
      currentMonth: today.m,
      danUmjesecu: 1,
      dayDetails: false,
      chosenDay: null,
      chosenYear: today.y,
      pageHeaderHeight: 0,
      searchText: '',
      items: null,
    }
  },
  async preFetch ({ store }) {
    try {
      await store.dispatch('main/getKalendar')
    } catch (err) {
      console.error(err)
    }
  },
  created() {
    this.currentMonth = this.today.m
    this.chosenDay = this.mjeseci[this.currentMonth][this.today.d - 1]

    this.getKalendar()
       .then(res => {
         this.items = this.getKalendarObject //ovo radi
       })
       .catch(error => {
          console.error(error)
        })
    },
  mounted () {
    this.pageHeaderHeight = this.$refs.pageHeader.clientHeight
    this.scrollToDay(this.$refs['day_' + (this.today.d - 1)][0].$el)
  },
  computed: {
    ...mapGetters('main', ['getIsOnline', 'getKalendarObject', 'getKalendarObjectNY', 'getGodine']),
    showDialog: {
      get () {
        return this.$store.getters['main/getShowDialog']
      },
      set (val) {
        console.log(val)
        this.$store.commit('main/setShowDialog', val)
      }
    },
    getSaints () {
      return this.mjeseci[this.currentMonth][this.chosenDay.d - 1].sveci
    },
    getReadings () {
      return this.mjeseci[this.currentMonth][this.chosenDay.d - 1].citanja
    },
    checkNextYear() {
      return this.$q.localStorage.has('kalendar' + (this.today.y + 1))
    },
    mjeseci () {
      return this.chosenYear === today.y ? groupBy(this.getKalendarObject, dan => dan.m) : groupBy(this.getKalendarObjectNY, dan => dan.m)
    },
    filteredSveci (){
      if( this.searchText == ''){
        return this.items;
      }
      return this.items.filter((item) => {
        if (this.searchText == null) {
          this.searchText = ''
        }
        return item.sveci.toLowerCase().match(this.searchText.toLowerCase()) || item.pomicni_blag.toLowerCase().match(this.searchText.toLowerCase())
      })
    }
  },
  methods: {
    searchState(){
      console.log(this.getSearchState)
    },
    ...mapActions('main', ['getKalendar']),
    ...mapMutations('main', ['clearStateVars', 'setSearchOff']),
    scrollToDay (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    isToday (day) { return day.d === this.today.d.toString() && day.m === this.today.m.toString() && this.chosenYear === this.today.y },
    isHoliday (day) { return !parseInt(day.radniDan) },
    isFeast (day) { return !!day.pomicni_blag },
    isSunday (day) { return this.dayOfWeek2(day) === 'Ned' },
    getDayClasses (day) {
      let classes = []
      if (this.isToday(day)) classes.push('is-today')
      if (!this.isSunday(day) && !this.isHoliday(day)) classes.push('is-workingday')
      if (this.isSunday(day)) classes.push('is-sunday')
      if (this.isHoliday(day)) classes.push('is-holiday')
      if (this.isFeast(day)) classes.push('is-feast')
      return classes
    },
    getColor (boja) {
      let color, text
      switch (boja) {
        case 'crvena': color = 'red'; text = 'white'; break
        case 'zelena': color = 'green'; text = 'white'; break
        case 'ljubičasta': color = 'purple'; text = 'white'; break
        case 'ružičasta': color = 'purple'; text = 'white'; break
        case 'crvena ili ljubičasta': color = 'purple'; text = 'white'; break
        case 'ljubičasta ili ružičasta': color = 'pink-3'; text = 'white'; break
        default: color = 'white'; text = 'black'
      }
      return [color, boja, text]
    },
    createEvent(g, m, d, naslov) {
      var startDate = new Date(g, m - 1, d, 10, 0, 0, 0, 0); // beware: month 0 = january, 11 = december
      var endDate = new Date(g, m - 1, d, 11, 0, 0, 0, 0);
      var title = naslov;
      var eventLocation = "Katolički kalendar";
      var notes = "";
      var success = function(message) {
        alert("Success: " + JSON.stringify(message));
      };
      var error = function(message) {
        alert("Error: " + message);
      };
      var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
      calOptions.recurrence = "yearly"; // supported are: daily, weekly, monthly, yearly
      calOptions.calendarName = "MyCreatedCalendar"; // iOS only
      calOptions.calendarId = 1; // Android only, use id obtained from listCalendars() call which is described below. This will be ignored on iOS in favor of calendarName and vice versa. Default: 1.
      // create an event silently (on Android < 4 an interactive dialog is shown)
      // window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,success,error);
      window.plugins.calendar.createEventInteractivelyWithOptions(title, eventLocation, notes, startDate, endDate, calOptions, success, error);
    },
    openHilp(d, m) {
      window.open('http://www.hilp.hr/liturgija-dana/?god=2020&mj=' + m + '&dan=' + d, "_blank");
      console.log('Kliknuo sam!!!');
    },
    showDay(dan) {
      this.dayDetails = true
      this.chosenDay = dan
    },
    // showDialog() {
    //   this.$q.dialog({
    //     title: 'Alert<em>!</em>',
    //     message: '<em>I can</em> <span class="text-red">use</span> <strong>HTML</strong>',
    //     html: true
    //   }).onOk(() => {
    //     // console.log('OK')
    //   }).onCancel(() => {
    //     // console.log('Cancel')
    //   }).onDismiss(() => {
    //     // console.log('I am triggered on both OK and Cancel')
    //   })
    // },
    dayOfWeek2(day) {
      const danDate = new Date(this.chosenYear, parseInt(day.m) - 1, day.d)
      return date.formatDate(danDate, 'ddd')
    },
    tweakHeight(offset) {
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
<style lang="sass" scoped>
.day
  padding: 1rem 0.5rem
  .title
    color: $red-10
    font-weight: 700
  .body
    color: $brown
  .caption
    color: $brown
  .day-icon
    .day-in-week
      text-align: center
      font-size: 0.75rem
      line-height: 1rem
      font-weight: 800
      letter-spacing: 2px
      padding: 0
      color: white
    .date
      padding: 0.5rem
      line-height: 1.5rem
      font-size: 1.25rem
      width: 4.5rem
      text-align: center
      font-weight: 600
  &.is-today
    background-color: $brown-2
  &.is-workingday
    .day-in-week
      background-color: $brown-5
    .date
      color: $brown-5
  &.is-sunday
    .day-in-week
      background-color: $red-10
    .date
      color: $red-10
  &.is-holiday
    .day-in-week
      background-color: $red-10
    .date
      color: $red-10
</style>
