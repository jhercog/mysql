<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'

if (!LocalStorage.has('userSettings')) {
  LocalStorage.set('userSettings', JSON.stringify([{setting: "automaticUpdate", value: "1"},{setting: "favorites", value: []}]))
}

export default {
  name: 'App',
  async preFetch ({ store }) {
    await store.dispatch('main/checkIsOnline')
  },
  async created () {
    // Quasar ima nativnu podršku za hrvatski jezik, uključujući i nazive dana i mjeseca
    // Ovdje importiramo hrvatski locale i namještamo ga kao quasar default
    const lang = await import('quasar/lang/hr')
    this.$q.lang.set(lang.default)
  //   console.log('app');
  //
  //   if (this.$q.platform.is.desktop) {
  //     this.$store.dispatch('main/checkIsOnlineDesktop')
  //     console.log('Desktop Device');
  //
  //   }else{
  //     this.$store.dispatch('main/checkIsOnline')
  //     console.log('Mobile Device');
  //
  //   }
  //
  //   console.log('app2');
  //
  }
}
</script>
