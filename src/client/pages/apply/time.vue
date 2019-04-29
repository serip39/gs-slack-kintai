<script>
export default {
  name: 'changeTime',

  props: {
    req: {
      type: Array,
      default: () => ([])
    }
  },

  data () {
    return {
      date: new Date(),
      reason: ''
    }
  },

  computed: {
    monthName () {
      const months = []
      for (let i = 1; i <= 12; i++) {
        months.push(i + '月')
      }
      return months
    }
  },

  mounted () {
    if (!this.req.length) {
      const dt = new Date()
      this.date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
    } else {
      const reqObj = this.req.reduce((acc, obj) => {
        acc[obj.key] = obj.val
        return acc
      }, {})
      this.date = reqObj.date
      this.reason = reqObj.reason
    }
  },

  methods: {
    toCheck () {
      const data =[
        {
          key: 'date',
          desc: '申請日時',
          val: this.date
        },{
          key: 'reason',
          desc: '理由',
          val: this.reason
        }
      ]
      this.$emit('copy', data)
      this.$emit('toggle-checked')
    },

    cancel () {
      this.$emit('init')
    }
  }
}
</script>


<template lang="html">
  <div class="change-time">
    <b-field label="日付">
      <b-datepicker
        v-model="date"
        placeholder="日付を選択してください"
        icon="calendar-today"
        :month-names="monthName"
        :day-names="['日', '月', '火', '水', '木', '金', '土']"
        :mobile-native="false" />
    </b-field>
    <b-field label="時間">
      <b-timepicker
        v-model="date"
        placeholder="時間を選択してください"
        icon="clock"
        :increment-minutes="15"
        :mobile-native="false" />
    </b-field>
    <b-field label="理由">
      <b-input
        v-model="reason"
        maxlength="500"
        type="textarea"
        placeholder="理由などを記入してください。" />
    </b-field>
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
        @click="toCheck">
        確認画面へ
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  button {
    width: 40%;
  }
}
</style>
