<script>
import Nav from '@/components/nav'

export default {
  name: 'app',

  components: { Nav }
}
</script>

<template lang="html">
  <div id="app">
    <Nav />
    <router-view />
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
