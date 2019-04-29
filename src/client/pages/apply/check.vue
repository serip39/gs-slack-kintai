<script>
export default {
  name: 'check',

  props: {
    type: {
      type: Object,
      default: () => ({})
    },
    req: {
      type: Array,
      default: () => ([])
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      isLoading: false,
      isCompleted: false
    }
  },

  filters: {
    arrangedStr: (val, key) => {
      if (key === 'type') {
        switch (val) {
          case 'paid':
            return '有給休暇申請'
          case 'compensation':
            return '代休申請'
          case 'special':
            return '慶弔休暇申請'
          case 'absence':
            return '欠勤申請'
        }
      }
      if (key.match(/date/i)) {
        const weekday = ['日', '月', '火', '水', '木', '金', '土']
        let format = 'YYYY/MM/DD(WW) hh:mm'
        format = format.replace(/YYYY/g, val.getFullYear())
        format = format.replace(/MM/g, ('0' + (val.getMonth() + 1)).slice(-2))
        format = format.replace(/DD/g, ('0' + val.getDate()).slice(-2))
        format = format.replace(/WW/g, weekday[val.getDay()])
        format = format.replace(/hh/g, ('0' + val.getHours()).slice(-2))
        format = format.replace(/mm/g, ('0' + val.getMinutes()).slice(-2))
        format = format.replace(/ss/g, ('0' + val.getSeconds()).slice(-2))
        return format
      }
      return val
    }
  },

  computed: {
    arrangedReq () {
      if (this.type.name !== 'vacation') return this.req
      const clone = JSON.parse(JSON.stringify(this.req))
      return clone.map(obj => {
        if (obj.key.match(/date/i)) obj.val = this.setDatetime(obj.key, obj.val)
        return obj
      })
    }

  },

  methods: {
    dateToStr (date) {
      let format = 'YYYY-MM-DD hh:mm:ss'
      format = format.replace(/YYYY/g, date.getFullYear())
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
      return format
    },

    typeStr (val) {
      switch (val) {
        case 'paid':
          return '有給休暇申請'
        case 'compensation':
          return '代休申請'
        case 'special':
          return '慶弔休暇申請'
        case 'absence':
          return '欠勤申請'
      }
    },

    setDatetime (key, obj) {
      let dt = new Date(obj.dt)
      if (key === 'fromDate') {
        dt = obj.time === 'afternoon' ? dt.setHours(13, 30, 0) : dt.setHours(9, 30, 0)
      } else if (key === 'toDate') {
        dt = obj.time === 'morning' ? dt.setHours(13, 30, 0) : dt.setHours(18, 30, 0)
      }
      return new Date(dt)
    },

    arrangeData (obj) {
      const result = {}
      result.user = this.user.slackName
      result.task = this.type.name === 'vacation' ? this.type.name + '-' + obj.type : this.type.name
      result.from = this.type.name === 'vacation' ? obj.fromDate :
        (this.type.name === 'earlyIn' || this.type.name === 'lateIn') ? obj.date : ''
      result.to = this.type.name === 'vacation' ? obj.toDate :
        (this.type.name === 'earlyOut' || this.type.name === 'overWork') ? obj.date : ''
      result.reason = obj.reason
      return result
    },

    submit () {
      this.toggleLoading()

      const reqObj = this.arrangedReq.reduce((acc, obj) => {
        acc[obj.key] = obj.key.match(/date/i) ? this.dateToStr(obj.val) : obj.val
        return acc
      }, {})

      google.script.run
        .withSuccessHandler(data => {
          console.log(data)
          this.isCompleted = true
        })
        .withFailureHandler(err => {
          console.log(err)
        }).postApply(this.arrangeData(reqObj))

      this.toggleLoading()
    },

    cancel () {
      this.$emit('toggle-checked')
    },

    toggleLoading () {
      this.isLoading = !this.isLoading
    }
  }
}
</script>


<template lang="html">
  <div class="check">
    <b-loading :active.sync="isLoading" />
    <p v-show="!isCompleted">
      この内容で申請してもよろしいでしょうか？
    </p>
    <table>
      <tr v-for="obj in arrangedReq">
        <th>{{ obj.desc }}</th>
        <td>{{ obj.val | arrangedStr(obj.key) }}</td>
      </tr>
    </table>
    <div
      v-if="!isCompleted"
      class="block buttons">
      <button
        type="button"
        class="button is-dark is-outlined"
        @click="cancel">
        キャンセル
      </button>
      <button
        type="button"
        class="button is-primary"
        @click="submit">
        申請
      </button>
    </div>
    <div
      v-else
      class="block">
      <p>上記の申請が完了しました。</p>
      <button
        type="button"
        class="button is-primary"
        @click="$emit('go-top')">
        トップに戻る
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  table-layout: fixed;
  th {
    width: 25%;
  }
  td {
    overflow-wrap: break-word;
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
  button {
    width: 40%;
  }
}
</style>
