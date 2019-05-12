<script>
export default {
  name: 'TimeSheet',

  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      isLoading: true,
      screen: '',
      month: '',
      selectedId: null,
      defaultOpenedDetails: [],
      records: [],
      columns: []
    }
  },

  computed: {
    isEmpty () {
      return !this.records.length
    },

    isMobile () {
      return this.screen === 'mobile'
    },

    strMonth () {
      if (!this.month) return ''
      return this.format(new Date(this.month), 'YYYY年MM月')
    },

    columnsForPC () {
      return [
        {
          field: 'date',
          label: '日付',
          centered: true,
        },
        {
          field: 'clockIn',
          label: '出勤時間',
          centered: true,
        },
        {
          field: 'clockOut',
          label: '退勤時間',
          centered: true,
        },
        {
          field: 'breakStart',
          label: '休憩開始',
          centered: true,
        },
        {
          field: 'breakEnd',
          label: '休憩終了',
          centered: true,
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
    },

    columnsForMobile () {
      return [
        {
          field: 'date',
          label: '日付',
          centered: true,
        },
        {
          field: 'status',
          label: '',
          centered: true,
        },
        {
          field: 'clockIn',
          label: '出勤',
          centered: true,
        },
        {
          field: 'clockOut',
          label: '退勤',
          centered: true,
        },
        {
          field: 'break',
          label: '休憩',
          centered: true
        },
        {
          field: 'length',
          label: '勤務',
          centered: true
        }
      ]
    }
  },

  created () {
    this.setMonth()
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },

  mounted () {
    this.getData()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    setMonth () {
      const now = new Date()
      this.month = this.getFirstDay(now)
    },

    getFirstDay (date) {
      const dt = new Date(date)
      return this.format(new Date(dt.getFullYear(), dt.getMonth(), 1))
    },

    getLastDay (date) {
      const dt = new Date(date)
      return this.format(new Date(dt.getFullYear(), dt.getMonth() + 1, 0))
    },

    getLastMonthFirstDay (date) {
      const dt = new Date(date)
      return this.format(new Date(dt.getFullYear(), dt.getMonth() - 1, 1))
    },

    getNextMonthFirstDay (date) {
      const dt = new Date(date)
      return this.format(new Date(dt.getFullYear(), dt.getMonth() + 1, 1))
    },

    format (date, format) {
      if (!format) format = 'YYYY/MM/DD'
      format = format.replace(/YYYY/g, date.getFullYear())
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
      return format
    },

    goTo (action) {
      if (action === 'last') this.month = this.getLastMonthFirstDay(this.month)
      if (action === 'next') this.month = this.getNextMonthFirstDay(this.month)
      this.getData()
    },

    handleResize () {
      const width = window.innerWidth
      this.screen = width < 769 ? 'mobile' :
        width < 1024 ? 'tablet' :
          width < 1216 ? 'desktop' :
            width < 1408 ? 'widescreen' :
              'fullhd'
      this.columns  = this.screen === 'mobile' ? this.columnsForMobile : this.columnsForPC
    },

    toggle (row) {
      if (!this.isMobile) return
      this.selectedId = row.id
      this.$refs.table.toggleDetails(row)
    },

    closeAllOtherDetails (row) {
      this.defaultOpenedDetails = [ row.date ]
    },

    addHoliday (row) {
      const intWeek = row.date
      if (intWeek.includes('日')) return 'sunday'
      if (intWeek.includes('土')) return 'saturday'
      if (intWeek.includes('祝')) return 'national'
      return ''
    },

    getData () {
      this.isLoading = true
      const fromDate = this.month
      const toDate = this.getLastDay(this.month)
      google.script.run
      .withSuccessHandler(data => this.setData(data))
      .withFailureHandler(err => {
        console.log(err)
      }).getTimeRecords(this.user.slackName, fromDate, toDate)
    },

    setData (data) {
      this.records = data
      this.isLoading = false
    }
  }
}
</script>

<template lang="html">
  <div class="container timesheet">
    <h2 class="subtitle">勤怠状況</h2>
    <div class="content">
      <div class="select-month">
        <span
          class="arrow"
          @click="goTo('last')">
          <b-icon
            icon="chevron-double-left"
            size="is-medium"
            type="is-primary" />
          前月へ
        </span>
        <span class="month">
          {{ strMonth }}
        </span>
        <span
          class="arrow"
          @click="goTo('next')">
          翌月へ
          <b-icon
            icon="chevron-double-right"
            size="is-medium"
            type="is-primary" />
        </span>
      </div>
      <b-table
        :data="isEmpty ? [] : records"
        ref="table"
        :columns="columns"
        :bordered="true"
        :striped="true"
        :hoverable="true"
        :loading="isLoading"
        :mobile-cards="false"
        :narrowed="isMobile"
        :detailed="isMobile"
        detail-key="date"
        :opened-detailed="defaultOpenedDetails"
        :row-class="row => addHoliday(row)"
        @details-open="row => closeAllOtherDetails(row)"
        :showDetailIcon="false"
        @click="toggle($event)">

        <template slot="detail" slot-scope="props">
          <dl class="content datalist">
            <dt>休憩開始</dt>
            <dd>{{ props.row.breakStart }}</dd>
            <dt>休憩終了</dt>
            <dd>{{ props.row.breakEnd }}</dd>
            <dt>残業時間</dt>
            <dd>{{ props.row.extra }}</dd>
            <dt>深夜残業</dt>
            <dd>{{ props.row.lateNight }}</dd>
          </dl>
        </template>

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
</template>

<style lang="scss" scoped>
.timesheet {
  padding: 0 5px 20px;
}
.datalist {
  display: flex;
  flex-wrap: wrap;
  dt {
    flex: 0 0 20%;
  }
  dd {
    flex: 0 0 30%;
    margin: 0;
  }
}
.select-month {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 20px;
  .month {
    line-height: 40px;
    font-weight: 600;
  }
  .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #2991E1;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
