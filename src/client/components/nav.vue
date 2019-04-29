<script>
export default {
  name: 'Navigation',

  data () {
    return {
      isBurgerOpen: false
    }
  },

  methods: {
    toggleBurger () {
      this.isBurgerOpen = !this.isBurgerOpen
    },

    selectNav (page) {
      this.toggleBurger()
      this.$emit('go-to', page)
    }
  }
}
</script>

<template lang="html">
  <nav
    class="navbar is-primary"
    role="navigation"
    aria-label="main navigation">

    <div class="container">
      <div class="navbar-brand">
        <span class="navbar-item">
          <h1 class="title">
            勤怠管理
          </h1>
        </span>

        <span
          role="button"
          class="navbar-burger"
          :class="isBurgerOpen ? 'is-active' : ''"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasic"
          @click="toggleBurger">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </span>
      </div>

      <div
        id="navbarBasic"
        class="navbar-menu"
        :class="isBurgerOpen ? 'is-active' : ''">
        <div class="navbar-start">
          <!-- navbar items -->
        </div>

        <div class="navbar-end">
          <a
            class="navbar-item"
            @click="selectNav('timesheet')">
            <b-icon
              icon="calendar-clock" />
            <span class="name">出勤簿</span>
          </a>
          <a
            class="navbar-item"
            @click="selectNav('apply')">
            <b-icon
              icon="square-edit-outline" />
            <span class="name">各種申請</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.title {
  color: #fff;
  font-size: 1.5em;
}
.name {
  padding-left: 3px;
}
</style>
