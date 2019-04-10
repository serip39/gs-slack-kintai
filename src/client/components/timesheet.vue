<template lang="html">
  <section class="section">
    <div class="container">
      <h1 class="title">勤怠状況</h1>
      <div class="content">
        <b-table
          :data="isEmpty ? [] : records"
          :columns="columns"
          :bordered="true"
          :striped="true"
          :mobile-cards="true">
          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>Nothing here.</p>
              </div>
            </section>
          </template>
        </b-table>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TimeSheet',

  data() {
    return {
      records: [],
      columns: [
        {
          field: 'date',
          label: '日付',
          centered: true
        },
        {
          field: 'clockIn',
          label: '出勤時間',
          centered: true
        },
        {
          field: 'clockOut',
          label: '退勤時間',
          centered: true
        },
        {
          field: 'breakStart',
          label: '休憩開始',
          centered: true
        },
        {
          field: 'breakEnd',
          label: '休憩終了',
          centered: true
        },
        {
          field: 'break',
          label: '休憩時間',
          centered: true
        },
        {
          field: 'extra',
          label: '残業時間',
          centered: true
        },
        {
          field: 'lateNight',
          label: '深夜残業',
          centered: true
        },
        {
          field: 'length',
          label: '勤務時間',
          centered: true
        },
        {
          field: 'status',
          label: '勤怠状況',
        },
      ]
    }
  },

  computed: {
    isEmpty () {
      return !this.records.length
    }
  },

  created () {
    this.getData('2019/04/01', '2019/04/30')
  },

  methods: {
    setData (data) {
      this.records = data
    },

    getData (startDate, endDate) {
      google.script.run
      .withSuccessHandler(data => this.setData(data))
      .withFailureHandler(err => {
        console.log(err)
        alert('データの取得に失敗しました。')
      }).getTimeRecords(startDate, endDate)
    }
  }
}
</script>
