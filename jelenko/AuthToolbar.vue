<template>
  <div>
    <q-btn
      color="primary"
      size="md"
      label="Login"
      unelevated
      rounded
      no-caps
      :to="{ name: 'Login' }"
    />
    <q-btn
      color="primary"
      size="md"
      label="Register"
      unelevated
      rounded
      no-caps
      :to="{ name: 'Register' }"
    />
  </div>
</template>

<script>
export default {
  name: 'AuthToolbar',
  data () {
    return {}
  }
}
</script>
