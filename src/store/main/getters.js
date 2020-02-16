import { date } from 'quasar'
import axios from 'axios'
import {LocalStorage} from 'quasar';

const newDate = new Date()
const currYear = newDate.getFullYear()
const nextYear = newDate.getFullYear() + 1
/*
export function someGetter (state) {
}
*/
export function getToday (state) {
  return state.today
}
export function getShowDialog (state) {
  return state.showDialog
}
export function getIsOnline (state) {
  return state.isOnline
}

export function getKalendarObject (state) {
  // console.log('get kalendar objekt');
  // console.log(state.kalendar);
  return state.kalendar
}
export function getKalendarObjectNY (state) {
  return state.kalendarNY
}

export function getKalendarObjectLS (state) {
  return LocalStorage.getItem('kalendar'+currYear)
}
export function getKalendarObjectLSNY (state) {
  if (LocalStorage.getItem('kalendar'+nextYear).exists) {
    // console.log('SLJEDEĆA godina POSTOJI');
    // return LocalStorage.getItem('kalendar'+nextYear)
  }else {
    // console.log('SLJEDEĆA godina ne postoji');
  }
}

export function getMolitvenikObject (state) {
  // console.log('get molitvenik objekt');
  // console.log(state.molitvenik);
  return state.molitvenik
}

export function getSettingsObject (state) {
  // console.log('get settings objekt');
  // console.log(state.settings);
  return state.settings
}

export function getPraznici (state) {
  // console.log('getPraznici getter');
  // console.log(state.settings);
  return state.praznici
}

// praznici2 (state) => {
//   console.log('praznici2 getter');
//   // console.log(state.settings);
//   return state.praznici
// }

export function getTodaysData (state) {
  let data = {
    sveci: '',
    blagdan: '',
    prazblag: '',
    pomicni_blag: '',
    radniDan: ''
  }
  if (state.kalendar) {
    let month = state.kalendar.filter(item => item.m === state.today.m.toString())
    let day = month.find(item => item.d === state.today.d.toString())
    data.sveci = day.sveci
    data.blagdan = day.blagdan
    data.prazblag = day.prazblag
    data.pomicni_blag = day.pomicni_blag
    data.radniDan = day.radniDan
  }
  return data
}

export function getKalMolVersionLocal (state) {
// console.log('getKalVersionLocal getter');

// if (state.settings==null) {
//   console.log('osam');
//   return null;
// }
  // console.log('state.settings', state.settings);
  // let ver_kal = state.settings.find(item => {
  //   return item.setting === 'verzija_kalendara'
  // })
  // let ver_mol = state.settings.find(item => {
  //   return item.setting === 'verzija_molitvenika'
  // })
  let ver_kal = LocalStorage.getItem('kalendarVerLocal')
  let ver_mol = LocalStorage.getItem('molitvenikVerLocal')
  // console.log('verzija_kalendaraLOK ',ver_kal);
  // console.log('verzija_molitvenikaLOK ',ver_mol);
  return {
    ver_kal: ver_kal,
    ver_mol: ver_mol,
  }
}

// export function getKalMolVersionLocal (state) {
// console.log('getKalVersionLocal getter');
//
// if (state.settings==null) {
//   console.log('osam');
//   return null;
// }
//   // console.log('state.settings', state.settings);
//   let ver_kal = state.settings.find(item => {
//     return item.setting === 'verzija_kalendara'
//   })
//   let ver_mol = state.settings.find(item => {
//     return item.setting === 'verzija_molitvenika'
//   })
//   console.log('verzija_kalendara ',ver_kal.value);
//   console.log('verzija_molitvenika ',ver_mol.value);
//   return {
//     ver_kal: ver_kal.value,
//     ver_mol: ver_mol.value,
//   }
// }

export function getSuglasnostLS ( state ) {
  // console.log('suglasnost :',LocalStorage.getItem('suglasnost'));
  return LocalStorage.getItem('suglasnost')
}

export function getGodine ( state ) {
  var object = LocalStorage.getItem('kalendar')[0];
  let keysArray = []
  for ( var keys in object ) {
    keysArray.push([keys])
  }
  // let god1 = keysArray[7][0]
  // let god2 = keysArray[11][0]//.length
  // god1 = god1.substr(god1.length-4, god1.length)
  // god2 = god2.substr(god2.length-4, god2.length)
  // console.log('..........', god1);
  // console.log('..........', god2);
  // return {godina1:god1,godina2:god2}
}

export function getMoonClass ( state ) {
  return ({ day, month, year }) => {
    let b, c, e, jd
    if(month < 3){
        year--
        month += 12
    }
    ++month
    c = 365.25 * year
    e = 30.6 * month
    jd = c + e + day - 694039.09  /* jd Is total days elapsed */
    jd /= 29.5305882           /* divide by the moon cycle (29.53 days) */
    b = parseInt(jd)//'    b = jd		   /* Int(jd) -> b, take integer part of jd */
    jd -= b		  /* subtract integer part To leave fractional part of original jd */
    b = Math.round(jd * 28)
    b =   b & 27		  //'' /* 0 AND 8 are the same so turn 8 into 0 */
    let moonClass
    switch (b) {
      case 0: moonClass = 'wi wi-moon-alt-new'; break
      case 1: moonClass = 'wi wi-moon-alt-waxing-crescent-1'; break
      case 2: moonClass = 'wi wi-moon-alt-waxing-crescent-2'; break
      case 3: moonClass = 'wi wi-moon-alt-waxing-crescent-3'; break
      case 4: moonClass = 'wi wi-moon-alt-waxing-crescent-4'; break
      case 5: moonClass = 'wi wi-moon-alt-waxing-crescent-5'; break
      case 6: moonClass = 'wi wi-moon-alt-waxing-crescent-6'; break
      case 7: moonClass = 'wi wi-moon-alt-first-quarter'; break
      case 8: moonClass = 'wi wi-moon-alt-waxing-gibbous-1'; break
      case 9: moonClass = 'wi wi-moon-alt-waxing-gibbous-2'; break
      case 10: moonClass = 'wi wi-moon-alt-waxing-gibbous-3'; break
      case 11: moonClass = 'wi wi-moon-alt-waxing-gibbous-4'; break
      case 12: moonClass = 'wi wi-moon-alt-waxing-gibbous-5'; break
      case 13: moonClass = 'wi wi-moon-alt-waxing-gibbous-6'; break
      case 14: moonClass = 'wi wi-moon-alt-full'; break
      case 15: moonClass = 'wi wi-moon-alt-waning-gibbous-1'; break
      case 16: moonClass = 'wi wi-moon-alt-waning-gibbous-2'; break
      case 17: moonClass = 'wi wi-moon-alt-waning-gibbous-3'; break
      case 18: moonClass = 'wi wi-moon-alt-waning-gibbous-4'; break
      case 19: moonClass = 'wi wi-moon-alt-waning-gibbous-5'; break
      case 20: moonClass = 'wi wi-moon-alt-waning-gibbous-6'; break
      case 21: moonClass = 'wi wi-moon-alt-third-quarter'; break
      case 22: moonClass = 'wi wi-moon-alt-waning-crescent-1'; break
      case 23: moonClass = 'wi wi-moon-alt-waning-crescent-2'; break
      case 24: moonClass = 'wi wi-moon-alt-waning-crescent-3'; break
      case 25: moonClass = 'wi wi-moon-alt-waning-crescent-4'; break
      case 26: moonClass = 'wi wi-moon-alt-waning-crescent-5'; break
      case 27: moonClass = 'wi wi-moon-alt-waning-crescent-6'; break
      default: moonClass = 'wi wi-moon-alt-new';
    }
    return moonClass
  }
}

// export async function getKalMolVersionRemote (commit,state) {
// console.log('getKalVersion getter');
//
// var formdata = new FormData();
// formdata.append ('upit', 'settings');
// return axios.post('http://vitkadesign.com/katkalTest.php', formdata)
//   .then((response) => {
//     // LocalStorage.set('settingsRemote', response.data)
//     })
//   .catch(error => {
//      console.error(error)
//    })
//
//    // commit('setSettingsRemoteObject', LocalStorage.getItem('settingsRemote'))
//
//    if (state.settingsRemote==null) {
//      return null;
//    }
//
//   let ver_kal = state.settingsRemote.find(item => {
//     return item.setting === 'verzija_kalendara'
//   })
//
//   let ver_mol = state.settingsRemote.find(item => {
//     return item.setting === 'verzija_molitvenika'
//   })
//
//   console.log(ver_kal.value);
//   console.log(ver_mol.value);
//
//   // return {
//   //   ver_kal: ver_kal.value,
//   //   ver_mol: ver_mol.value,
//   // }
//
// }

// export async function getKalMolVersionRemote ({ commit, state }) {
//   console.log('Dohvaćam settings iz ONLINE baze')
//   var formdata = new FormData();
//   formdata.append ('upit', 'settings');
//   return axios.post('http://vitkadesign.com/katkalTest.php', formdata)
//     .then((response) => {
//       // LocalStorage.set('settings', response.data)
//       console.log('remote verzije: ', response.data);
//       let ver_kal = response.data.find(item => {
//         return item.setting === 'verzija_kalendara'
//         console.log(ver_kal);
//       })
//
//       let ver_mol = response.data.find(item => {
//         return item.setting === 'verzija_molitvenika'
//         console.log(ver_mol);
//
//       })
//
//     })
//     .catch(error => {
//        console.error(error)
//      })
//
//      return {
//        ver_kal: ver_kal.value,
//        ver_mol: ver_mol.value,
//      }
// }
