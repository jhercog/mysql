<template>
  <q-layout view="lHh lpR lFf">
    <!-- <q-layout view="hHh Lpr lFf"> -->
    <q-header elevated>
      <div class="bg-brown-5" style="height: 50px;">
        <div class="flex fit items-center justify-center text-h6" style="width:100%">
          {{ $route.name.toUpperCase() }}
        </div>
        <div class="absolute-left flex items-center q-pl-sm">
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            icon="menu"
            aria-label="Menu"
          />
          <q-separator dark vertical inset class="q-mx-sm"/>
          <q-btn v-if="$route.name !== 'Home'" flat dense icon="home" to="/" outline rounded color="white" />
        </div>
        <div class="absolute-right flex items-center q-pr-sm">
          <q-btn v-if="$route.name == 'Kalendar'" @click="showDialog = true" size="lg" flat dense icon="search" outline rounded color="white" />
          <q-btn v-if="$route.name == 'Molitvenik'" @click="showDialog = true"  size="lg" flat dense icon="stars" outline rounded color="white" />
          <q-separator dark vertical inset class="q-mx-sm"/>
          <q-avatar size="lg" color="brown-3">
              <img src="statics/katkalikona.png">
          </q-avatar>
        </div>
      </div>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="200"
      show-if-above
      bordered
      content-class="bg-grey"
    >
      <q-scroll-area class="fit">
        <q-list dark>
          <!-- <q-item-label header>Navigation</q-item-label> -->

          <!-- :to="{ path: nav.to, hash: '#dan6' }" -->
          <!-- <q-item
            v-for="nav in navs"
            :key="nav.label"
            :to="{ path: nav.to }"
            class="text-grey-4"
            exact
            clickable>
            <q-item-section avatar>
              <q-icon :name="nav.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ nav.label }}</q-item-label>
            </q-item-section>
          </q-item> -->

          <q-item clickable tag="a" target="_blank" href="http://vitkadesign.com/vitkadesign_privacy_policy.html">
            <q-item-section avatar>
              <q-icon name="policy" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Politika privatnosti</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://play.google.com/store/apps/details?id=com.vitka">
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ocijeni aplikaciju</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="sendMail()">
            <q-item-section avatar>
              <q-icon name="mail_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Pošalji komentar</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="shareApp()"  v-if="$q.platform.is.mobile">
            <q-item-section avatar>
              <q-icon name="share" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Podijeli aplikaciju</q-item-label>
            </q-item-section>
          </q-item>


        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />

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

    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import { mapGetters, mapState, mapMutations } from 'vuex'
// import { Platform } from 'quasar'

// console.log('platforma cordova: ',$q.platform.is.cordova);
// navigator.splashscreen.hide()
// ...mapGetters('main', ['getKalendarObject']),

// --------File plugin------------------
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    // console.log(cordova.file);
}

export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false,
      persistent: false,
      navs: [
        {
          label: 'Početna',
          icon: 'home',
          to: '/',
          link: ''
        },
        {
          label: 'KALENDAR',
          icon: 'calendar_today',
          to: '/kalendar',
          link: ''
        },
        {
          label: 'MOLITVENIK',
          icon: 'book',
          to: '/molitvenik',
          link: ''
        },
        {
          label: 'PRAZNICI I BLAGDANI U RH',
          icon: 'star',
          to: '/blagdani',
          link: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters('main', ['getKalendarObject', 'getSuglasnostLS']),
    ...mapState('main', ['isOnline']),
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
    searchOn: {
      get () {
        return this.$store.getters['main/getSearchOn']
      },
      set (val) {
        this.$store.commit('main/setSearchOn', val)
      }
    },
    showDialog: {
      get () {
        return this.$store.getters['main/getShowDialog']
      },
      set (val) {
        this.$store.commit('main/setShowDialog', val)
      }
    }
  },

  mounted () {
    this.checkSuglasnost()
  },

  methods: {
    ...mapMutations('main',['setSuglasnostLS', 'setSearchOn']),

    checkSuglasnost() {
      // console.log('check suglasnost = ',this.getSuglasnostLS);
      if (this.getSuglasnostLS == 0 || this.getSuglasnostLS == null) {
        this.persistent = true
      }else{
        this.persistent = false
      }
    },

    writeFile(fileEntry, dataObj) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function() {
                // console.log("Successful file write...");
                readFile(fileEntry);
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
              console.log('ććććććććććć', this.$q.localStorage.kalendar);
              // dataObj = new Blob(['Nešto sam upisao u file'], { type: 'text/plain' });
              // dataObj = new Blob([this.getKalendarObject], { type: 'text/plain' });
            }

            fileWriter.write(dataObj);
        });
    },

    clearStorage (){
      this.$q.localStorage.clear()
      this.clearStateVars()
      this.mjeseci = null
    },

    sendMail(){
      window.cordova.plugins.email.open({
        app: 'mailto',
        to:      'vitkadesign@gmail.com',
        subject: 'Katolički kalendar JS - Komentar',
        body:    'How are you? Nice greetings from Leipzig'
        });

    },

    async shareIt(){
      let shareRet = await Share.share({
        title: 'See cool stuff',
        text: 'Really awesome thing you need to see right meow',
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share with buddies'
      });
    },

    shareApp(){
      navigator.share('Vidi ovu super kuul aplikaciju. Ima sve: molitvenik, kalendar, podsjetnik, widget.. E widget nema još :D','Podijeli Kalendar','plain/text')
      console.log('ŠERAM');
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
          case 6: moonImg = 'statics/moon6-40.png'; break
          case 7: moonImg = 'statics/moon7-40.png'; break
          // default: moonImg = '';
        }
        return moonImg
    }

  }
}
</script>
