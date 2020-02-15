<template>
  <q-page class="q-pa-sm"
    >
      <!-- v-touch-swipe.mouse.left.right="handleSwipe" -->

    <!-- +++++++++++++++++++++++++++++++++++++++++ -->
    <!-- @click="scrollToElement($refs.xxx)" -->
    <q-btn label="Calendar"
      clickable
      @click="createEvent()"
      outline
      rounded
      color="green-5" />
    <br>
    <q-btn label="Home"
      to="/"
      outline
      rounded
      color="green-5" />
    <br>

    <div class="row q-pa-md" >
      KALENDAR
    </div>

    <!-- ***************************** -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
   <q-tab :name="mjesec.id" :label="mjesec.name"
      v-for="mjesec in nazivMjeseci"
      :key="mjesec.id" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated swipeable>
      <q-tab-panel :name="mjesec.id" v-for="mjesec in nazivMjeseci">
        <div class="text-h5 text-center">{{mjesec.name}}</div>
        <q-list class="scroll overflow-hidden" ref="lista" >
            <q-item class="scroll overflow-hidden"
              v-for="dan in mjeseci[tab]"
              :ref="'item_' + dan.id"
              :key="dan.id">
                 <q-item-section side>
                  <q-btn outline
                    :color="dayOfWeek2(dan.d, mjesec.id).day ==='ned' ? 'red' : 'green'"
                    size = "lg">
                    {{ dan.d }}.{{ tab }}
                    <q-badge
                      floating
                      :color="dayOfWeek2(dan.d, mjesec.id).day ==='ned' ? 'red' : 'green'"
                    >
                    {{ dayOfWeek2(dan.d, mjesec.id).day }}. {{ dan.d }} . {{mjesec.id}}</q-badge>
                  </q-btn>
                </q-item-section>

              <q-item-section
                clickable
                @click="showDayDetails = true, getChosenDate(dan.d)"
                >
                <q-item-label
                  v-if="dan.pomicni_blag_2020"
                  class = "text-red">
                    {{ dan.pomicni_blag_2020 }}
                  </q-item-label>
                <q-item-label
                 :class="dan.d == getDate().d && dan.m == getDate().m ? 'text-blue' : 'text-green'">
                 {{ dan.sveci }}</q-item-label>
                <q-item-label caption lines="2">{{ dan.blagdan_2020 }}</q-item-label>
              </q-item-section>
          </q-item>
            <q-separator spaced inset />
          </q-list>
      </q-tab-panel>
    </q-tab-panels>

    </q-tabs>
    <!-- +++++++++++++++++++++++++ -->

<!-- <div class="q-pa-sm flex flex-center bg-grey-3" style="width: 100%;">

    <q-pagination style="width: 100%x;"
      v-model="current"
      :direction-links="true"
      :max="12"
      :input="true"
      :boundary-links="false"
    >

    </q-pagination>
</div> -->


<!-- <div class="scroll overflow-hidden" style="height: 300px" ref="xxx"> -->


  <!-- <q-list class="scroll overflow-hidden" ref="lista" >
      <q-item class="scroll overflow-hidden"
        v-for="dan in mjeseci[current]"
        :ref="'item_' + dan.id"
        :key="dan.id">
           <q-item-section side>
            <q-btn outline
              :color="dayOfWeek2(dan.d, current).day ==='ned' ? 'red' : 'green'"
              size = "lg">
              {{ dan.d }}.{{ current }}
              <q-badge
                floating
                :color="dayOfWeek2(dan.d, current).day ==='ned' ? 'red' : 'green'"
              >
              {{ dayOfWeek2(dan.d, current).day }}. {{ dan.d }} .{{ dayOfWeek2(dan.d, current).mnt }}</q-badge>
            </q-btn>
          </q-item-section>

        <q-item-section
          clickable
          @click="showDayDetails = true, getChosenDate(dan.d)"
          >
          <q-item-label
            v-if="dan.pomicni_blag_2020"
            class = "text-red">
              {{ dan.pomicni_blag_2020 }}
            </q-item-label>
          <q-item-label
           :class="dan.d == getDate().d && dan.m == getDate().m ? 'text-blue' : 'text-green'">
           {{ dan.sveci }}</q-item-label>
          <q-item-label caption lines="2">{{ dan.blagdan_2020 }}</q-item-label>
        </q-item-section>
    </q-item>
      <q-separator spaced inset />
    </q-list> -->



    <q-dialog v-model="showDayDetails">
      <q-card>
        <!-- :class="'bg-red'" -->
        <!-- :class="dayOfWeek({{mjeseci[current][chosenDate - 1].boja_2020}} ==='crvena' ? 'teal' : 'white'" -->
        <q-toolbar>
          <q-avatar>
            <img src="statics/katkalikona.png">
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold">{{dayOfWeek2(chosenDate, tab).day}}, </span>{{ chosenDate}}.{{ tab }}.2020. </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-btn color="secondary" label="Podsjetnik" @click="createEvent('2020', chosenDate, tab, 'nešto')" />

        <q-card-section>
          <q-card>
            <q-toolbar>

              <q-toolbar-title>Sveci</q-toolbar-title>
            </q-toolbar>
              <q-card-section class="text-h6">
                {{mjeseci[current] ? mjeseci[current][chosenDate - 1].sveci : null }}<br>
                {{mjeseci[current] ? mjeseci[current][chosenDate - 1].boja_2020 : null }}<br>
              </q-card-section>
              </q-card>
              <br>
              <q-card
              clickable
              type="a"
              href="https://biblija.ks.hr/">
                <q-toolbar>
                  <q-avatar icon="book">
                  </q-avatar>
                  <q-toolbar-title>Čitanja</q-toolbar-title>
                </q-toolbar>
              <q-card-section  class="text-h6"
              clickable
              @click="openHilp(chosenDate,current)">
                <!-- {{mjeseci[curent][chosenDate]}} -->

                {{mjeseci[current] ? mjeseci[current][chosenDate - 1].citanja_2020 : null}}<br>
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
// takes an element object
function scrollToElementXX (el) {

  const target = getScrollTarget(el)
  const offset = el.offsetTop + 200
  const duration = 1000
  setScrollPosition(target, offset, duration)
}
// window.scrollTo(300, 300)

 export default {
   data () {
     return {
        mjeseci: null,
        current: 2,
        danUmjesecu: 1,
        showDayDetails: false,
        chosenDate: 1,
        tab: null,
        nazivMjeseci: [
          {
            id: '1',
            name: 'SIJEČANJ',
          },
          {
            id: '2',
            name: 'VELJAČA',
          },
          {
            id: '3',
            name: 'OŽUJAK',
          },
          {
            id: '4',
            name: 'TRAVANJ',
          },
          {
            id: '5',
            name: 'SVIBANJ',
          },
          {
            id: '6',
            name: 'LIPANJ',
          },
          {
            id: '7',
            name: 'SRPANJ',
          },
          {
            id: '8',
            name: 'KOLOVOZ',
          },
          {
            id: '9',
            name: 'RUJAN',
          },
          {
            id: '10',
            name: 'LISTOPAD',
          },
          {
            id: '11',
            name: 'STUDENI',
          },
          {
            id: '12',
            name: 'PROSINAC',
          },
        ]
      }
   },
   // watch: {
   //  'mjeseci.current' () {
   //      setScrollPosition(getScrollTarget(this.$refs.list), 10, 250)
   //      console.log('WATCHER - - - - -');
   //    },
   //  },

   mounted () {
     // window.scrollTo(300, 0)
   },
   computed: {
     ...mapState('main', ['kalendar']),
     ...mapGetters('main', ['getIsOnline', 'getKalendarObject']),

   },

   created () {
     // window.scrollTo(300, 300)
// This scroll to the bottom of your page. And then if you add a chat message run this code again
     // window.scrollTo(0,document.body.scrollHeight)

     // scrollToElement ('ajdi')
// this.scrollIntoView()
     this.setCurrent()

     this.getKalendar()
        .then(res => {
      this.mjeseci = groupBy(this.getKalendarObject, dan => dan.m)
      console.log('LocalStorage EMPTY stranica getter Kalendar?  ', this.$q.localStorage.isEmpty())
        })
        .catch(error => {
           console.error(error)
         })

        // console.log('kalendar',this.$store.state.kalendar);
        // this.mjeseci = groupBy(this.kalendar, dan => dan.m)
       },

   methods: {
     ...mapActions('main',['getKalendar']),
     ...mapMutations('main',['clearStateVars']),

     scrollToElement (el) {
       console.log('ovo je EL:',el);
       const target = getScrollTarget(el)
       const offset = el.offsetTop + 200
       const duration = 500
       setScrollPosition(target, offset, duration)
       console.log(target);
       console.log(el.scrollTop);
       console.log(el.offsetTop);
       // this.$refs.el.setScrollPosition(this.position, 300)
     },

     scrollToTarget2 () {
         setScrollPosition(getScrollTarget(this.$refs.naslov), 10, 250)
         console.log('WATCHER - - - - -');
       },

     scrollToTarget (el) {
       const target = getScrollTarget(el)
       const offset = el.offsetTop
       const duration = 500
       setScrollPosition(target, offset, duration)
     },

     createEvent(g, m, d, naslov){
       // prep some variables
        var startDate = new Date(g,m,d,10,0,0,0,0); // beware: month 0 = january, 11 = december
        var endDate = new Date(g,m,d,11,0,0,0,0);
        var title = "My nice event";
        var eventLocation = "Katolički kalendar";
        var notes = "Some notes about this event.";
        var success = function(message) { alert("Success: " + JSON.stringify(message)); };
        var error = function(message) { alert("Error: " + message); };

        // create an event interactively
        window.plugins.calendar.createEventInteractively(title,eventLocation,notes,startDate,endDate,success,error);
          // window.createEventInteractivelyWithOptions(title,eventLocation,notes,startDate,endDate,calOptions,success,error);
          // navigator.openCalendar();
          // window.plugins.calendar.openCalendar();
console.log('otvori kalendar');
// window.addEventListener('batterystatus', this.updateBatteryStatus, false)
     },

     setCurrent(){
       this.current = this.getDate().m
       // this.current = 'siječanj'
       console.log(this.current);
       this.tab = this.getDate().m.toString()
       // console.log(this.tab);
       // this.tab = '1'

     },
     openHilp(d, m){
       window.open('http://www.hilp.hr/liturgija-dana/?god=2020&mj='+m+'&dan='+d, "_blank");
       console.log('Kliknuo sam!!!');
     },
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

    getChosenDate(val){
      this.chosenDate = val
      console.log(this.current);
      console.log(val);
      return this.chosenDate
    },

     showDialog () {
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


     dayOfWeek2(val, val2){
       // console.log('val2=', val2, val);
       let newDate = new Date(2020, val2-1, val)
       // console.log(newDate);
       let dan = date.getDayOfWeek(newDate) // `day` is 4
       let day
       // switch (new Date().getDay()) {
         switch (dan) {
          case 1:
            day = "pon";
            break;
          case 2:
            day = "uto";
            break;
          case 3:
             day = "sri";
            break;
          case 4:
            day = "čet";
            break;
          case 5:
            day = "pet";
            break;
          case 6:
            day = "sub";
            break;
          case 7:
            day = "ned";
        }
       return {
         day: day,
         mnt: this.current
       }
     },

      clearStorage (){
        this.$q.localStorage.clear()
        this.clearStateVars()
        this.mjeseci = null
      },

      handleSwipe ({ evt, ...info }) {
      // native Javascript event
      if (info.direction == "left"){
        this.current++
        if(this.current > 12){
          this.current = 12
        }
      }
      if (info.direction == "right"){
        this.current--
        if(this.current < 1){
          this.current = 1
        }
      }
    }
   }
 }
</script>
