import {LocalStorage} from 'quasar';

export function setIsOnline (state, online) {
  state.isOnline = online
}

export function setShowDialog (state, val) {
  state.showDialog = val
}
export function setKalendarObject (state, val) {
  state.kalendar = val
  // console.log(':::u Mutaciji iz state.kalendar ' ,state.kalendar);
  // state.kalendar = '**************neka vrijednost'
}
export function setKalendarObjectNY (state, val) {
  state.kalendarNY = val
  // console.log(':::u Mutaciji iz state.kalendar ' ,state.kalendar);
  // state.kalendar = '**************neka vrijednost'
}

export function setMolitvenikObject (state, val) {
  state.molitvenik = val
  // console.log(':::u Mutaciji iz state.molitvenik ' ,state.molitvenik);
  // state.kalendar = '**************neka vrijednost'
}

export function setSettingsObject (state, val) {
  state.settings = val
  // console.log(':::u Mutaciji iz state.settings ' ,state.settings);
  // state.kalendar = '**************neka vrijednost'
}

export function setSettingsRemoteObject (state, val) {
  state.settingsRemote = val
  // console.log(':::u Mutaciji iz state.settingsRemote ' ,state.settingsRemote);
  // state.kalendar = '**************neka vrijednost'
}
export function clearStateVars ( state ) {
  state.kalendar = null
  state.molitvenik = null
  // console.log(':::u Mutaciji state.kalendar = ništa ' ,state.kalendar);
  // console.log(':::u Mutaciji state.molitvenik = ništa ' ,state.molitvenik);
}

export function setSuglasnostState ( state ) {
  // console.log('suglasnost state prije:',state.settings[8].value ,state.settings[8].value.type);
  state.settings[8].value = 1
  // console.log('suglasnost state poslije:',state.settings[8].value ,state.settings[8].value.type);
}

export function setSuglasnostLS ( state ) {
  // console.log('suglasnost state prije:', LocalStorage.getItem('suglasnost'), LocalStorage.getItem('settings')[8].value.type);
  // LocalStorage.setItem('settings')[8].value = 1
  let key = LocalStorage.getItem('settings')[8].setting
  // console.log('postavljam Suglasnost na 1');
  // LocalStorage.set(‘settings’, JSON.stringify(this.settings))
  LocalStorage.set('suglasnost', '1')
  // try {
  // LocalStorage.set('suglasnost', 1)
  // } catch (e) {
  //   // data wasn't successfully saved due to
  //   // a Web Storage API error
  // }
  // console.log('suglasnost state poslije:',LocalStorage.getItem('suglasnost'), LocalStorage.getItem('settings')[8].value.type);
}
