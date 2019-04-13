<script>
export default {
  name: 'applyVacation',

  data () {
    return {
      type: '',
      fromDate: {
        day: '',
        time: ''
      },
      toDate: {
        day: '',
        time: ''
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

  beforeRouteEnter (to, from, next) {
    console.log('test')
    console.log(to)
  },
}
</script>


<template lang="html">
  <section class="section">
    <div class="container">
      <h1 class="title">休暇申請</h1>
      <div class="content">
        <b-field
          label="休暇の種類を選択して下さい">
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
      </div>
      <div class="content">
        <div class="block">
          <b-field label="休暇日（いつから）">
            <b-datepicker
              v-model="fromDate.day"
              placeholder="日付を選択してください"
              icon="calendar-today">
            </b-datepicker>
          </b-field>
        </div>
        <div class="block">
          <b-radio
            v-for="time in times"
            :key="time.value"
            v-model="fromDate.time"
            :native-value="time.value">
            {{ time.label }}
          </b-radio>
        </div>
      </div>
      <div class="content">
        <div class="block">
          <b-field label="休暇日（いつまで）">
            <b-datepicker
              v-model="toDate.day"
              placeholder="日付を選択してください"
              icon="calendar-today">
            </b-datepicker>
          </b-field>
        </div>
        <div class="block">
          <b-radio
            v-for="time in times"
            :key="time.value"
            v-model="toDate.time"
            :native-value="time.value">
            {{ time.label }}
          </b-radio>
        </div>
      </div>
      <div class="content">
        <b-field label="休暇理由">
          <b-input
            v-model="reason"
            maxlength="200"
            type="textarea"
            placeholder="伝達事項などがある場合はここに記入してください。" />
        </b-field>
      </div>
    </div>
    <div>type:{{ type }}</div>
    <div>fromDate:{{ fromDate.day }}</div>
    <div>fromDate:{{ fromDate.time }}</div>
    <div>toDate:{{ toDate.day }}</div>
    <div>toDate:{{ toDate.time }}</div>
    <div>reason:{{ reason }}</div>
  </section>
</template>