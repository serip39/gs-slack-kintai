<script>
import Login from '@/pages/login'
import Nav from '@/components/nav'
import Timesheet from '@/pages/timesheet'
import Apply from '@/pages/apply'

export default {
  name: 'app',

  components: {
    Login,
    Nav,
    Timesheet,
    Apply
  },

  data () {
    return {
      user: {},
      page: 'timesheet'
    }
  },

  computed: {
    isLogIn () {
      return !!this.user.name
    }
  },

  methods: {
    logIn (user) {
      this.user = user
    },

    goTo (pageName) {
      if (this.page === pageName) {
        this.page = ''
        this.$nextTick(() => {
          this.page = pageName
        })
      } else {
        this.page = pageName
      }
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
      <Nav
        :user="user"
        @go-to="goTo" />
      <Timesheet
        v-if="page === 'timesheet'"
        :user="user" />
      <Apply
        v-else-if="page === 'apply'"
        :user="user"
        @go-to="goTo" />
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

@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 400;
  src: local("Noto Sans CJK JP Light"),
       url(//fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Light.woff2) format('woff2'),
       url(//fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Light.woff) format('woff'),
       url(//fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Light.otf) format('opentype');
}

html, body {
  font: 90% "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Kaku Gothic ProN", "Yu Gothic", YuGothic, Verdana, Meiryo, sans-serif;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: unset;
  font-display: auto;
}

.subtitle {
  margin: .5em .5em !important;
}

.content table td, .content table th {
  padding: 0.5em 0.3em;
}

.navbar-item:hover {
  cursor: pointer;
}

.input.num {
  width: 25%;
}

.button {
  width: 100%;
  &.is-disabled {
    pointer-events: none;
    &::hover {
      cursor: not-allowed;
    }
  }
}

// .timepicker {
//   .dropdown-content {
//     padding: 0;
//   }
//   .dropdown-content {
//     .control {
//       font-size: 1rem;
//       .select select {
//         font-weight: normal;
//       }
//       &.is-colon {
//         font-size: 1.25em;
//       }
//     }
//     .select:not {
//       height: inherit;
//     }
//   }
// }
</style>
