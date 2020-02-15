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
            clickable
            ripple
            class="q-px-md q-py-sm"
            @click="showDay(dan)"
          >
            <q-item-section side>
              <q-card flat bordered class="dan">
                <!-- :class="{
                  'bg-red-10': dayOfWeek2(dan) === 'Ned' && dan.d !== today.d.toString(),
                  'bg-brown-5': dayOfWeek2(dan) !== 'Ned' && dan.d !== today.d.toString(),
                  'bg-blue': dan.d === today.d.toString() && dan.m === today.m.toString()
                }" -->
                <q-card-section
                  class="dan-u-tjednu"
                  :class="getDayClasses(dan)"
                >
                  {{ dayOfWeek2(dan).toUpperCase() }}
                </q-card-section>
                <q-card-section
                  class="datum"
                  :class="{
                    'text-red-10': dayOfWeek2(dan) === 'Ned' && dan.d !== today.d.toString(),
                    'text-brown-5': dayOfWeek2(dan) !== 'Ned' && dan.d !== today.d.toString(),
                    'text-blue': dan.d === today.d.toString() && dan.m === today.m.toString()
                  }"
                >
                    {{ dan.d }}.{{ dan.m }}
                </q-card-section>
              </q-card>
            </q-item-section>

            <q-item-section>
              <q-item-label v-if="dan.pomicni_blag" class="text-weight-bold text-red-10">
                {{ dan.pomicni_blag }}
              </q-item-label>
              <q-item-label :class="dan.d == today.d && dan.m == today.m ? 'text-blue text-weight-bold' : 'text-brown'">
                {{ dan.sveci }}</q-item-label>
              <q-item-label caption lines="2">{{ dan.blagdan }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div :class="'bg-' + getColor(dan.boja)[0]" style="width: 0.75rem; height: 0.75rem; border-radius: 0.375rem" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-tab-panel>
  </q-tab-panels>

  <div ref="pageHeader" class="absolute-top">
    <div class="q-pt-lg">
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
            <div class="text-h6">
              Sveci
            </div>
            <q-space />
            <q-chip :color="getColor(this.chosenDay.boja)[0]" :text-color="getColor(this.chosenDay.boja)[2]">
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
            <div class="text-h6">
              Čitanja
            </div>
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
      mjeseci: null,
      currentMonth: today.m,
      danUmjesecu: 1,
      dayDetails: false,
      chosenDay: null,
      pageHeaderHeight: 0,
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
    this.mjeseci = groupBy(this.getKalendarObject, dan => dan.m)
    this.chosenDay = this.mjeseci[this.currentMonth][this.today.d - 1]
  },
  mounted () {
    // this.$nextTick(() => {
    this.pageHeaderHeight = this.$refs.pageHeader.clientHeight
    this.scrollToDay(this.$refs['day_' + (this.today.d - 1)][0].$el)
    // })
  },
  computed: {
    ...mapState('main', ['kalendar']),
    ...mapGetters('main', ['getIsOnline', 'getKalendarObject', 'getGodine']),
    getSaints () {
      return this.mjeseci[this.currentMonth][this.chosenDay.d - 1].sveci
    },
    getReadings () {
      return this.mjeseci[this.currentMonth][this.chosenDay.d - 1].citanja
    }
  },
  methods: {
    ...mapActions('main', ['getKalendar']),
    ...mapMutations('main', ['clearStateVars']),
    scrollToDay (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 1000
      setScrollPosition(target, offset, duration)
    },
    isToday (day) {
      return day.d === this.today.d.toString() && day.m === this.today.m.toString()
    },
    getDayClasses (day) {
      console.log(day.d, day.m)
      console.log(this.isToday(day))
      // console.log(this.dayOfWeek2(day), day.d, day.m)

      // switch (true) {
      //   case 'crvena': color = 'red'; text = 'white'; break
      //   case 'zelena': color = 'green'; text = 'white'; break
      //   case 'ljubičasta': color = 'purple'; text = 'white'; break
      //   case 'ružičasta': color = 'purple'; text = 'white'; break
      //   case 'crvena ili ljubičasta': color = 'purple'; text = 'white'; break
      //   case 'ljubičasta ili ružičasta': color = 'pink'; text = 'white'; break
      //   default: color = 'white'; text = 'black'
      // }
      // :class="{
      //   'bg-red-10': dayOfWeek2(dan) === 'Ned' && dan.d !== today.d.toString(),
      //   'bg-brown-5': dayOfWeek2(dan) !== 'Ned' && dan.d !== today.d.toString(),
      //   'bg-blue': dan.d === today.d.toString() && dan.m === today.m.toString()
      // }"
    },
    getColor (boja) {
      let color, text
      switch (boja) {
        case 'crvena': color = 'red'; text = 'white'; break
        case 'zelena': color = 'green'; text = 'white'; break
        case 'ljubičasta': color = 'purple'; text = 'white'; break
        case 'ružičasta': color = 'purple'; text = 'white'; break
        case 'crvena ili ljubičasta': color = 'purple'; text = 'white'; break
        case 'ljubičasta ili ružičasta': color = 'pink'; text = 'white'; break
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

    showDialog() {
      this.$q.dialog({
        title: 'Alert<em>!</em>',
        message: '<em>I can</em> <span class="text-red">use</span> <strong>HTML</strong>',
        html: true
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    dayOfWeek2(dan) {
      // console.log(dan)
      const danDate = new Date(this.today.y, parseInt(dan.m) - 1, dan.d)
      return date.formatDate(danDate, 'ddd')
    },

    tweakHeight(offset) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      }
    }

  }
}
</script>
<style lang="sass" scoped>
  .dan
    .dan-u-tjednu
      text-align: center
      font-size: 0.75rem
      line-height: 1rem
      font-weight: 800
      letter-spacing: 2px
      padding: 0
      color: white
    .datum
      padding: 0.5rem
      line-height: 1.5rem
      font-size: 1.25rem
      width: 4.5rem
      text-align: center
      font-weight: 600

</style>
