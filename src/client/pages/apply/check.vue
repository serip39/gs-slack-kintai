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
      console.log(key, val)
      if (key.match(/date/i)) {
        const weekday = ['日', '月', '火', '水', '木', '金', '土']
        let formatDate = 'YYYY/MM/DD(WW) hh:mm'
        formatDate = formatDate.replace(/YYYY/g, val.getFullYear())
        formatDate = formatDate.replace(/MM/g, ('0' + (val.getMonth() + 1)).slice(-2))
        formatDate = formatDate.replace(/DD/g, ('0' + val.getDate()).slice(-2))
        formatDate = formatDate.replace(/WW/g, weekday[val.getDay()])
        formatDate = formatDate.replace(/hh/g, ('0' + val.getHours()).slice(-2))
        formatDate = formatDate.replace(/mm/g, ('0' + val.getMinutes()).slice(-2))
        formatDate = formatDate.replace(/ss/g, ('0' + val.getSeconds()).slice(-2))
        return formatDate
      }
      return val
    }
  },

  computed: {

  },

  methods: {
    dateToStr (date) {
      let format = 'YYYY-MM-DD hh:mm'
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

    submit () {
      console.log(this.req)
      const reqObj = this.req.reduce((acc, obj) => {
        acc[obj.key] = obj.key.match(/date/i) ? this.dateToStr(obj.val) : obj.val
        return acc
      }, {})
      console.log(reqObj, this.type)
      const task = this.type.name === 'vacation' ? this.type.name + '-' + reqObj.type : this.type.name
      const data = {
        user: this.user.slackName,
        task,
        from: reqObj.fromDate,
        to: reqObj.toDate,
        text: reqObj.reason
      }
      google.script.run
        .withSuccessHandler(data => {
          console.log(data)
        })
        .withFailureHandler(err => {
          console.log(err)
        }).postApply(data)
    },

    cancel () {
      this.$emit('toggle-checked')
    }
  }
}
</script>


<template lang="html">
  <div class="check">
    <div class="desc">
      この内容で申請してもよろしいでしょうか？
    </div>
    <table>
      <tr v-for="obj in req">
        <th>{{ obj.desc }}</th>
        <td>{{ obj.val | arrangedStr(obj.key) }}</td>
      </tr>
    </table>
    <div class="block buttons">
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
  </div>
</template>

<style lang="scss" scoped>
.desc {
  padding-bottom: 10px;
}
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
