<script>
import Login from '@/components/login'
import Timesheet from '@/components/timesheet'

export default {
  name: 'app',

  components: {
    Login,
    Timesheet
  }
}
</script>

<template lang="html">
  <div id="app">
    <div>
      <router-link to="/login">page1</router-link>
      <router-link to="/timesheet">page2</router-link>
    </div>
    <router-view />
    <!-- <Login />
    <Timesheet /> -->
  </div>
</template>
