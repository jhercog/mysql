<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  async preFetch ({ store }) {
    await store.dispatch('App/checkIsOnline')
  },
  mounted () {
    this.userLogged()
  },
  methods: {
    ...mapActions('Auth', ['userLogged'])
  }
}
</script>
