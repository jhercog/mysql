<template>
  <div>
    <q-btn
      :color="isOnline ? 'primary' : 'negative'"
      :label="isOnline ? 'Logout' : 'offline'"
      :disable="!isOnline"
      size="md"
      class="q-mr-sm"
      unelevated
      rounded
      no-caps
      @click="userLogout()"
    />
    <q-avatar color="secondary" text-color="white">
      {{ initials }}
    </q-avatar>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'UserAvatar',
  data () {
    return {}
  },
  computed: {
    ...mapState('App', ['isOnline']),
    ...mapState('Auth', ['userDetails']),
    initials () {
      const user = this.$parse.User.current()
      return user.get('firstName').charAt(0) + user.get('lastName').charAt(0)
    }
  },
  methods: {
    ...mapActions('Auth', ['userLogout'])
  }
}
</script>
