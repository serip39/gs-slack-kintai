<script>
import Login from '@/pages/login'
import Nav from '@/components/nav'

export default {
  name: 'app',

  components: { Login, Nav },

  data () {
    return {
      user: {},

    }
  },

  computed: {
    isLogIn () {
      return !!this.user.name
    }
  },

  methods: {
    logIn (user) {
      console.log('user', user)
      this.user = user
    }
  }
}
</script>

<template lang="html">
  <div id="app">
    <Login
      v-if="!isLogIn"
      @log-in="logIn"
    />
    <template v-else>
      <Nav />
      <div>
        {{ user.name }}
      </div>
      <router-view />
    </template>
  </div>
</template>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #2991E1;
$primary-invert: findColorInvert($primary);

// Setup $colors to use as bulma classes
$colors: (
  "white": ($white, $black),
  "black": ($black, $white),
  "light": ($light, $light-invert),
  "dark": ($dark, $dark-invert),
  "primary": ($primary, $primary-invert),
  "info": ($info, $info-invert),
  "success": ($success, $success-invert),
  "warning": ($warning, $warning-invert),
  "danger": ($danger, $danger-invert)
);

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
