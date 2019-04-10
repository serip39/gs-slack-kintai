<script>
import Nav from '@/components/nav'
import Timesheet from '@/components/timesheet'

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
