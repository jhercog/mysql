// import { groupBy } from 'lodash'
// import axios from 'axios'
import {LocalStorage} from 'quasar';
import axios from 'axios'

export async function checkIsOnline ({ dispatch, commit, state }) {
  commit('setIsOnline', navigator.onLine)

  console.log('checkIsOnline', state.isOnline)
  // await dispatch('getKalendar')
  window.addEventListener('online', async () => {
    console.log('EventListener online');
    commit('setIsOnline', true)
    console.log('actions online');
  }, false)

  window.addEventListener('offline', async () => {
    commit('setIsOnline', false)
    console.log('EventListener offline');
    // TODO: Fetch from Localstore
    // this.mjeseci = groupBy(this.$q.localStorage.getItem('kalendar'), dan => dan.m)
  }, false)
}

export async function getKalendar ({ dispatch, commit, state }) {
  if (LocalStorage.isEmpty()) {
    // Ako je LS PRAZAN, dohvati sve tablice i spremi ih u LS
    commit('setKalendarObject', LocalStorage.getItem('kalendar'))
    // await dispatch('fetchKalendarFromNet')
    // commit('kalendar', '----------------------')
    // commit('setKalendarObject', '*******xxxxxxx*******')
    // await dispatch('saveKalLStoStateVar')
    await dispatch('fetchMolitvenikFromNet')
  } else {
    // Ako LS nije PRAZAN
    //Provjeri postoji li tablica 'kalendar'. Ako NE, dohvati
    if (!LocalStorage.has('kalendar')) {
      await dispatch('fetchKalendarFromNet')
      commit('setKalendarObject', LocalStorage.getItem('kalendar'))

    }else {
      commit('setKalendarObject', LocalStorage.getItem('kalendar'))

    }
    //Provjeri postoji li tablica 'molitvenik'. Ako NE, dohvati
    if (!LocalStorage.has('molitvenik')) {
      await dispatch('fetchMolitvenikFromNet')
    }
  }
  console.log('LocalStorage EMPTY Actions?  ', LocalStorage.isEmpty())
}

export async function fetchKalendarFromNet ({ commit, state }) {
  var formdata = new FormData();
  formdata.append ('upit', 'kalendar');
  axios.post('http://vitkadesign.com/katkalTest.php', formdata)
    .then((response) => {
      LocalStorage.set('kalendar', response.data)
    })
    .catch(error => {
       console.error(error)
     })
}

export async function fetchMolitvenikFromNet ({ commit, state }) {
  var formdata = new FormData();
  formdata.append ('upit', 'molitvenik');
  axios.post('http://vitkadesign.com/katkalTest.php', formdata)
    .then((response) => {
      LocalStorage.set('molitvenik', response.data)
    })
    .catch(error => {
       console.error(error)
     })
}

export async function saveKalLStoStateVar ({ dispatch, commit }) {
  // commit('setKalendarObject', LocalStorage.getItem('kalendar'))
  commit('setKalendarObject', '*******xxxxxxx*******')
  // console.log('>>>>>>>>>>saveKalLStoStateVar');
}

export async function saveMolLStoStateVar ({ commit }) {
  commit('molitvenik', LocalStorage.getItem("molitvenik"))
}
