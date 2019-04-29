<script>
export default {
  name: 'applyVacation',

  props: {
    req: {
      type: Array,
      default: () => ([])
    }
  },

  data () {
    return {
      type: 'paid',
      term: 1,
      fromDate: {
        dt: new Date(),
        time: 'all'
      },
      toDate: {
        dt: new Date(),
        time: 'afternoon'
      },
      reason: '',
      vacationTypes: [
        {
          value: 'paid',
          label: '有給休暇申請'
        },
        {
          value: 'compensation',
          label: '代休申請'
        },
        {
          value: 'special',
          label: '慶弔休暇申請'
        },
        {
          value: 'absence',
          label: '欠勤申請'
        }
      ],
      times: [
        {
          value: 'all',
          label: '終日'
        },
        {
          value: 'morning',
          label: '午前'
        },
        {
          value: 'afternoon',
          label: '午後'
        }
      ]
    }
  },

  computed: {
    fromLabel () {
      if (this.term > 1) return '休暇日（いつから）'
      return '休暇日'
    },

    monthName () {
      const months = []
      for (let i = 1; i <= 12; i++) {
        months.push(i + '月')
      }
      return months
    },

    selectableTime () {
      if (this.term === 1) return this.times
      this.setInitTime()
      return this.times.filter(obj => obj.value !== 'all')
    },

    isCompleted () {
      return !!this.type && !!this.reason
    }
  },

  watch: {
    fromDate: {
      handler (obj) {
        const diff = this.toDate.dt.getTime() - obj.dt.getTime()
        if (diff < 0) {
          this.toDate.dt = obj.dt
        }
      },
      deep: true
    }
  },

  mounted () {
    if (!this.req.length) return
    const reqObj = this.req.reduce((acc, obj) => {
      acc[obj.key] = obj.val
      return acc
    }, {})
    this.type = reqObj.type
    this.term = reqObj.term
    this.fromDate = reqObj.fromDate
    this.toDate = reqObj.toDate
    this.reason = reqObj.reason
  },

  methods: {
    setInitTime () {
      if (this.fromDate.time === 'all') this.fromDate.time = 'morning'
    },

    toCheck () {
      if (this.term === 1) {
        this.toDate.dt = new Date(this.fromDate.dt)
        this.toDate.time = JSON.parse(JSON.stringify(this.fromDate.time))
      }
      const data =[
        {
          key: 'type',
          desc: '休暇種類',
          val: this.type
        },{
          key: 'term',
          desc: '休暇日数',
          val: this.term
        },{
          key: 'fromDate',
          desc: 'いつから',
          val: this.fromDate
        },{
          key: 'toDate',
          desc: 'いつまで',
          val: this.toDate
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
  <div class="vacation">
    <b-field label="休暇の種類を選択して下さい">
      <b-select
        v-model="type"
        placeholder="選択してください"
        expanded>
        <option
          v-for="type in vacationTypes"
          :key="type.value"
          :value="type.value">
          {{ type.label }}
        </option>
      </b-select>
    </b-field>
    <b-field
      label="休暇日数">
      <b-input
        v-model.number="term"
        type="number"
        placeholder="数字を選択してください"
        min="1"
        class="term"
        custom-class="num">
      </b-input>
    </b-field>
    <p>(※)上記は有休や代休の消化日数ではないので、2日以上連続で休む場合は2日以上を選択してください。</p>
    <b-field :label="fromLabel">
      <b-datepicker
        v-model="fromDate.dt"
        placeholder="日付を選択してください"
        icon="calendar-today"
        :month-names="monthName"
        :day-names="['日', '月', '火', '水', '木', '金', '土']"
        :mobile-native="false" />
    </b-field>
    <div class="block">
      <b-radio
        v-for="time in selectableTime"
        :key="time.value"
        v-model="fromDate.time"
        :native-value="time.value">
        {{ time.label }}
      </b-radio>
    </div>
    <template v-if="term > 1">
      <b-field label="休暇日（いつまで）">
        <b-datepicker
          v-model="toDate.dt"
          placeholder="日付を選択してください"
          icon="calendar-today"
          :min-date="fromDate.dt"
          :month-names="monthName"
          :day-names="['日', '月', '火', '水', '木', '金', '土']"
          :mobile-native="false" />
      </b-field>
      <div class="block">
        <b-radio
          v-for="time in selectableTime"
          :key="time.value"
          v-model="toDate.time"
          :native-value="time.value">
          {{ time.label }}
        </b-radio>
      </div>
    </template>
    <b-field label="休暇理由">
      <b-input
        v-model="reason"
        maxlength="500"
        type="textarea"
        placeholder="伝達事項などがある場合はここに記入してください。" />
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
        class="button"
        :class="isCompleted ? 'is-primary' : 'is-disabled'"
        @click="toCheck">
        確認画面へ
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.term {
  &:after {
    content: "日間";
    display: inline-block;
    height: 2.25em;
    line-height: 2.25em;
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
