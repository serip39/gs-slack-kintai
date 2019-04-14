<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      isLoading: true
    }
  },

  mounted () {
    this.tryLogin()
  },

  methods: {
    tryLogin () {
      const url = window.parent.document.referrer
      const query = url.match(/userId=\w+/g)
      if (query) {
        const userId = query[0].replace('userId=', '')
        google.script.run
          .withSuccessHandler(data => this.login(data))
          .withFailureHandler(err => {
            console.log(err)
          }).getUserData(userId)
      }
      this.endLoading()
    },

    getAccessUser () {

    },

    login (user) {
      this.$emit('log-in', user)
    },

    endLoading () {
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    }
  }
}
</script>

<template lang="html">
  <section class="section">
    <div class="container">
      <h1 class="title">勤怠管理システム</h1>
      <div class="content">
        <b-loading :active.sync="isLoading" />
        <div class="block">
          <b-field
          label="Email">
          <b-input
            type="email"
            v-model="username"
            icon="email"
            placeholder="メールアドレス" />
          </b-field>
          <b-field
            label="Password">
            <b-input
              type="password"
              v-model="password"
              password-reveal
              icon="key-variant"
              placeholder="パスワード" />
          </b-field>
        </div>
        <div class="block">
          <button
            type="button"
            class="button is-primary"
            @click="getAccessUser">
            ログイン
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.button {
  width: 100%;
}
</style>
