// import { groupBy } from 'lodash'
// import axios from 'axios'
import { Platform } from 'quasar'
import {LocalStorage} from 'quasar';
import axios from 'axios'
import { date } from 'quasar'

const newDate = new Date()
const currYear = newDate.getFullYear()
const nextYear = newDate.getFullYear() + 1

// console.log(currYear, nextYear);
// console.log('platforma desktop: ',Platform.is.desktop);

export async function checkIsOnline ({ commit, dispatch }) {
  commit('setIsOnline', navigator.onLine)
  window.addEventListener('online', async () => {
    commit('setIsOnline', true)
  }, false)
  window.addEventListener('offline', async () => {
    commit('setIsOnline', false)
  }, false)
}

export async function getKalendar ({ dispatch, commit, state }) {
  if (LocalStorage.isEmpty()) {
    console.log('LS PRAZAN ...... punim ......')
    // Ako je LS PRAZAN, dohvati sve tablice i spremi ih u LS

    await dispatch('fetchSettingsFromNet')
      commit('setSettingsObject', LocalStorage.getItem('settings'))
    await dispatch('fetchSettingsFromNetRemote')
      // commit('setSettingsRemoteObject', LocalStorage.getItem('settingsRemote'))

    await dispatch('fetchKalendarFromNet')
      commit('setKalendarObject', LocalStorage.getItem('kalendar'+currYear))
    await dispatch('fetchKalendarNYFromNet')
      commit('setKalendarObjectNY', LocalStorage.getItem('kalendar'+nextYear))
    await dispatch('fetchMolitvenikFromNet')
      commit('setMolitvenikObject', LocalStorage.getItem('molitvenik'))


      // dohvati početne vrijednosti verzija i suglasnosti i spremi ih u LS
      LocalStorage.set('kalendarVerLocal', LocalStorage.getItem('settingsRemote')[6].value)
      LocalStorage.set('molitvenikVerLocal', LocalStorage.getItem('settingsRemote')[7].value)
      LocalStorage.set('suglasnost', LocalStorage.getItem('settings')[8].value)

      // Ako je nextYerar = 1 (sljedeća godina spremna) - dohvaćam sljedeću godinu


  } else {
    // console.log('LS NIJE prazan')
    // Ako LS nije PRAZAN

    //Dohvati tablicu 'settingsRemote'.
      // console.log('Dohvaćam settingsRemote ');
      await dispatch('fetchSettingsFromNetRemote')
      // commit('setSettingsRemoteObject', LocalStorage.getItem('settingsRemote'))

    //Provjeri postoji li tablica 'kalendar'. Ako NE, dohvati
    if (!LocalStorage.has('kalendar'+currYear)) {
      console.log('kalendar nije u LS-u');
      await dispatch('fetchKalendarFromNet')
        commit('setKalendarObject', LocalStorage.getItem('kalendar'+currYear))
    }else {
      // Ako kalendar postoji
        // provjeri verziju kalendara
        if (LocalStorage.getItem('settingsRemote')[6].value > LocalStorage.getItem('kalendarVerLocal')) {
          //ponovno dohvati cijeli kalendar ako je remote verzija veća od lokalne verzije
          console.log('NOVA VERZIJA - dohvati KALENDAR ponovo');
          await dispatch('fetchKalendarFromNet')
            commit('setKalendarObject', LocalStorage.getItem('kalendar'+currYear))
            // postavi varziju kalendara u LS-u na novu vrijednost
            LocalStorage.set('kalendarVerLocal', LocalStorage.getItem('settingsRemote')[6].value)
            console.log('kalendarVer LS nakon promjene',LocalStorage.getItem('kalendarVerLocal'));
            // dohvati i kalendar za sljedeću godinu
            await dispatch('fetchKalendarNYFromNet')
        }
        // dohvati kalendar za sljedeću godinu bezuvjetno
        // await dispatch('fetchKalendarNYFromNet')

        // spremi kalendar u state varijablu
      // console.log('kalendar postoji -> kopiram iz LS-a u state var')
      commit('setKalendarObject', LocalStorage.getItem('kalendar'+currYear))
      if(LocalStorage.getItem('kalendar'+nextYear)) {
        commit('setKalendarObjectNY', LocalStorage.getItem('kalendar'+nextYear))
      }
    }

    //Provjeri postoji li kalendar za sljedeću godinu. Ako NE, dohvati
    if (!LocalStorage.has('kalendar'+nextYear)) {
      // console.log('kalendar za sljedeću godinu nije u LS-u');
      await dispatch('fetchKalendarNYFromNet')
        // commit('setMolitvenikObject', LocalStorage.getItem('molitvenik'))
    }else {
      // console.log('molitvenik postoji -> kopiram iz LS-a u state var')
      // commit('setMolitvenikObject', LocalStorage.getItem('molitvenik'))
    }

    //Provjeri postoji li tablica 'molitvenik'.
    // Ako NE, dohvati
    if (!LocalStorage.has('molitvenik')) {
      console.log('molitvenik nije u LS-u');
      await dispatch('fetchMolitvenikFromNet')
        commit('setMolitvenikObject', LocalStorage.getItem('molitvenik'))
    }else {
      // Ako postoji
        // provjeri verziju
      if (LocalStorage.getItem('settingsRemote')[7].value > LocalStorage.getItem('molitvenikVerLocal')) {
        //ponovno dohvati cijeli molitvenik
      console.log('NOVA VERZIJA - dohvati MOLITVENIK ponovo');
        await dispatch('fetchMolitvenikFromNet')
          commit('setMolitvenikObject', LocalStorage.getItem('molitvenik'))
          LocalStorage.set('molitvenikVerLocal', LocalStorage.getItem('settingsRemote')[7].value)
          console.log('kalendarVer LS nakon promjene',LocalStorage.getItem('molitvenikVerLocal'));
      }
      // console.log('molitvenik postoji -> kopiram iz LS-a u state var')
      commit('setMolitvenikObject', LocalStorage.getItem('molitvenik'))
    }

    //Provjeri postoji li tablica 'settings'. Ako NE, dohvati
    if (!LocalStorage.has('settings')) {
      console.log('settings ne postoji u LS-u');
      await dispatch('fetchSettingsFromNet')
        commit('setSettingsObject', LocalStorage.getItem('settings'))
    }else {
      // console.log('settings postoji -> kopiram iz LS-a u state var')
      commit('setSettingsObject', LocalStorage.getItem('settings'))
    }

  }

  // ----------------- kraj provjere Local Storage-a ----------------

  // ----------------------  File plugin
  if (Platform.is.mobile) {
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
      console.log('file system open: ' + dirEntry.name);
      var isAppend = true;
      // createFile(dirEntry, "fileToAppend.txt", isAppend);
      createFile(dirEntry, "kalendar.txt", isAppend);
    }, onErrorLoadFs);
    function createFile(dirEntry, fileName, isAppend) {
      // Creates a new file or returns the file if it already exists.
      dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
        writeFile(fileEntry, null, isAppend);
      }, onErrorCreateFile);
    }
    function onErrorCreateFile() {
      console.log("Create file fail...");}
      function onErrorReadFile() {
        console.log("Read file fail...");}
        function onErrorLoadFs() {
          console.log("File system fail...");
        }
        function displayFileData(data){
          // console.log(data);
          // alert(data);
        }
        function writeFile(fileEntry, dataObj) {
          // Create a FileWriter object for our FileEntry (log.txt).
          fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function() {
              readFile(fileEntry);
            };
            fileWriter.onerror = function (e) {
              console.log("Failed file write: " + e.toString());
            };
            if (!dataObj) {
              // console.log('---------------BLOB', LocalStorage.getItem('kalendar'));
              let kalBlob = LocalStorage.getItem('kalendar'+currYear)
              dataObj = new Blob([JSON.stringify(kalBlob)], { type: 'text/plain' });
            }
            fileWriter.write(dataObj);
          });
        }
        function readFile(fileEntry) {

          fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
              console.log("Ime file-a: " + fileEntry.name);
              // console.log("Successful file read: " + this.result);
              displayFileData(fileEntry.fullPath + ": " + this.result);
            };

            reader.readAsText(file);

          }, onErrorReadFile);
        }

  }
  // ---------------------- end File plugin



}

export async function fetchKalendarFromNet ({ commit, state }) {
  console.log('Dohvaćam kalendar iz ONLINE baze')
  var formdata = new FormData();
  formdata.append ('upit', 'kalendar');
  return axios.post('http://vitkadesign.com/katkalNEW.php', formdata)
    .then((response) => {
      LocalStorage.set('kalendar'+currYear, response.data)
      // console.log('------------spremio kalendar u LS ', response.data)
      console.log('------------spremio kalendar u LS ')
    })
    .catch(error => {
       console.error(error)
     })
}

export async function fetchKalendarNYFromNet ({ commit, state }) {
  // console.log('Dohvaćam kalendar iz ONLINE baze')
  var formdata = new FormData();
  formdata.append ('upit', 'kalendarNY');
  return axios.post('http://vitkadesign.com/katkalNEW.php', formdata)
    .then((response) => {
      LocalStorage.set('kalendar'+nextYear, response.data)
      // console.log('------------spremio kalendarNY u LS ', response.data)
      console.log('------------spremio kalendarNY u LS ')
    })
    .catch(error => {
       console.error(error)
     })
}

export async function fetchMolitvenikFromNet ({ commit, state }) {
  console.log('Dohvaćam molitvenik iz ONLINE baze')
  var formdata = new FormData();
  formdata.append ('upit', 'molitvenik');
  return axios.post('http://vitkadesign.com/katkalNEW.php', formdata)
    .then((response) => {
      LocalStorage.set('molitvenik', response.data)
      console.log('spremio molitvenik u LS')

    })
    .catch(error => {
       console.error(error)
     })
}

export async function fetchSettingsFromNet ({ commit, state }) {
  console.log('Dohvaćam settings iz ONLINE baze')
  var formdata = new FormData();
  formdata.append ('upit', 'settings');
  return axios.post('http://vitkadesign.com/katkalNEW.php', formdata)
    .then((response) => {
      LocalStorage.set('settings', response.data)
    })
    .catch(error => {
       console.error(error)
     })
}

export async function fetchSettingsFromNetRemote ({ commit, state }) {
  // console.log('Dohvaćam settings iz ONLINE baze')
  var formdata = new FormData();
  formdata.append ('upit', 'settings');
  return axios.post('http://vitkadesign.com/katkalNEW.php', formdata)
    .then((response) => {
      LocalStorage.set('settingsRemote', response.data)
    })
    .catch(error => {
       console.error(error)
     })
}

export async function fetchKalMolVersionRemote (commit, state) {
console.log('fetchKalMolVersionRemote action');

var formdata = new FormData();
formdata.append ('upit', 'settings_versions');
return axios.post('http://vitkadesign.com/katkalNEW.php', formdata)
  .then((response) => {
    LocalStorage.set('settingsRemote', response.data)
    console.log('tu saaaaamo');
    })
  .catch(error => {
     console.error(error)
     console.log('šest');
   })

   if (state.settingsRemote==null) {
     console.log('jedan');
     return null;
   }

  let ver_kal = state.settingsRemote.find(item => {
    console.log('dva');
    return item.setting === 'verzija_kalendara'
  })

  let ver_mol = state.settingsRemote.find(item => {
    console.log('tri');
    return item.setting === 'verzija_molitvenika'
  })

  console.log('dva',ver_kal.value);
  console.log('dva',ver_mol.value);

  return {
    ver_kal: ver_kal.value,
    ver_mol: ver_mol.value,
  }

}

export async function fetchSuglasnostVersionRemote (commit, state) {
console.log('fetchSuglasnostVersionRemote action');

var formdata = new FormData();
formdata.append ('upit', 'settings_suglasnost');
return axios.post('http://vitkadesign.com/katkalNEW.php', formdata)
  .then((response) => {
    LocalStorage.set('settingsRemote', response.data)
    console.log('settings--', response.data);
    })
  .catch(error => {
     console.error(error)
     console.log('šest');
   })

   if (state.settingsRemote==null) {
     console.log('jedan');
     return null;
   }

  let suglasnost = state.settingsRemote.find(item => {
    console.log('suglasnost1');
    return item.setting === 'suglasnost'
  })

  let ver_mol = state.settingsRemote.find(item => {
    console.log('tri');
    return item.setting === 'verzija_molitvenika'
  })

  console.log('suglasnost: ',suglasnost);
  // console.log('dva',ver_mol.value);

  return suglasnost.value

}

export async function getMoonClass ({ state }, { day, month, year }) {
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
