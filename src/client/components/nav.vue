<template lang="html">
  <nav class="navbar is-info" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item">
        勤怠管理
      </span>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <!-- navbar items -->
      </div>

      <div class="navbar-end">
        <router-link
          to="/timesheet"
          class="navbar-item">
          Timesheet
        </router-link>
        <router-link
          to="/apply/vacation"
          class="navbar-item">
          Vacation
        </router-link>
      </div>
    </div>
  </nav>
</template>
