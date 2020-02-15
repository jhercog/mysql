<template>
  <!-- <q-layout view="lHh lpR fFf"> -->
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          class="hamburger"
          :class="[ leftDrawerOpen ? 'open' : 'close' ]"
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu_open"
          aria-label="Menu"
        />

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <auth-toolbar v-if="!userDetails" />
        <user-avatar v-else />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      dark
      content-class="bg-secondary"
      side="left"
    >
      <q-toolbar>
        <q-toolbar-title>
          Harvey
        </q-toolbar-title>
      </q-toolbar>
      <q-separator dark />
      <q-list>
        <q-item
          v-for="(item, index) in mainMenu" :key="'item_' + index"
          clickable
          v-ripple
          :exact="item.name === 'Dashboard' ? true : false"
          :to="{ name: item.name }"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition
        appear
        name="transitions"
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutRight"
        mode="out-in"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import UserAvatar from 'components/UserAvatar'
import AuthToolbar from 'components/AuthToolbar'
const mainMenu = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Employees', icon: 'people' },
  { name: 'Records', icon: 'table_chart' }
]
export default {
  name: 'LayoutMain',
  data () {
    return {
      mainMenu,
      leftDrawerOpen: false
    }
  },
  computed: {
    ...mapState('Auth', ['userDetails']),
    title () {
      return this.$route.name
    }
  },
  components: {
    UserAvatar,
    AuthToolbar
  }
}
</script>

<style lang="scss" scoped>
.open {
  transform: rotate(0turn);
}
.close {
  transform: rotate(0.5turn);
}
</style>
