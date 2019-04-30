export default class {
  constructor () {
    this.startTime = '09:30'
    this.endTime = '18:30'
    this.nightTime = '22:00'
  }

  createCalender (start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    let calenders = []
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) { // eslint-disable-line
      let cloneDate = this.format(new Date(date.getTime()), 'YYYY/MM/DD')
      calenders.push([cloneDate])
    }
    return calenders
  }

  getNow (format) {
    const now = new Date()
    return this.format(now, 'YYYY-MM-DD hh:mm:ss')
  }

  format (date, format, overnight = false) {
    const weekday = ['日', '月', '火', '水', '木', '金', '土']
    if (!format) format = 'YYYY-MM-DD(WW) hh:mm:ss'
    format = format.replace(/YYYY/g, date.getFullYear())
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
    format = format.replace(/WW/g, weekday[date.getDay()])
    format = overnight ? format.replace(/hh/g, date.getHours() + 24)
      : format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
    return format
  }

  formatStr (key, date, clockIn) {
    if (key === 'date') return this.format(date, 'MM/DD(WW)')
    if (key === 'startedAt' || key === 'endedAt') return this.format(date, 'YYYY/MM/DD')
    if ((key === 'clockOut' || key === 'breakStart' || key === 'breakEnd') && !this.isSameDay(clockIn, date)) return this.format(date, 'hh:mm', true)
    return this.format(date, 'hh:mm')
  }

  diff (date1Str, date2Str, type) {
    const date1 = new Date(date1Str)
    const date2 = new Date(date2Str)
    const msDiff = date2.getTime() - date1.getTime()
    switch (type) {
      case 'days':
        // 1day = 24h × 60min × 60s × 1000ms
        return Math.floor(msDiff / (24 * 60 * 60 * 1000))
      case 'hours':
        // 1hour = 60min × 60s × 1000ms
        return Math.floor(msDiff / (60 * 60 * 1000))
      case 'minutes':
        // 1hour = 60min × 60s × 1000ms
        return Math.floor(msDiff / (60 * 1000))
      default:
        return 'error'
    }
  }

  isSameDay (date1, date2) {
    const day1 = date1.getDate()
    const day2 = date2.getDate()
    return day1 === day2
  }

  isBetween (date, fromDate, toDate) {
    const diffFrom = this.diff(fromDate, date, 'days')
    const diffTo = this.diff(date, toDate, 'days')
    if (diffFrom >= 0 && diffTo >= 0) return true
    return false
  }

  minToStr (min) {
    const h0 = ('0' + Math.floor(min / 60)).slice(-2)
    const m0 = ('0' + (min % 60)).slice(-2)
    return h0 + ':' + m0
  }

  setTime (date, time) {
    let dt = new Date(date)
    dt.setHours(Number(time.slice(0, 2)))
    dt.setMinutes(Number(time.slice(-2)))
    return dt
  }

  calLength (obj) {
    const startTime = this.setTime(obj.date, this.startTime)
    const endTime = this.setTime(obj.date, this.endTime)
    const nightTime = this.setTime(obj.date, this.nightTime)

    let lengthWork = this.diff(obj.clockIn, obj.clockOut, 'minutes')
    let lengthBreak = this.diff(obj.breakStart, obj.breakEnd, 'minutes')
    if (!obj.breakStart || !obj.breakEnd) lengthBreak = 0

    // 休憩時間に関して
    // 6時間(360min)を超え、8時間(480min)以下の場合：45分
    // 8時間(480min)を超える場合：1時間
    if (lengthWork > 480 && lengthBreak < 60) {
      lengthBreak = 60
    } else if (lengthWork > 360 && lengthBreak < 45) {
      lengthBreak = 45
    }

    // 労働時間から休憩時間を引く
    lengthWork -= lengthBreak

    let lengthExtraMorning = this.diff(obj.clockIn, startTime, 'minutes')
    let lengthExtraEvening = this.diff(endTime, obj.clockOut, 'minutes')
    lengthExtraMorning = lengthExtraMorning > 0 ? lengthExtraMorning : 0
    lengthExtraEvening = lengthExtraEvening > 0 ? lengthExtraEvening : 0

    let lengthNight = this.diff(nightTime, obj.clockOut, 'minutes')
    lengthNight = lengthNight > 0 ? lengthNight : 0
    lengthExtraEvening -= lengthNight

    obj.extra = this.minToStr(lengthExtraMorning + lengthExtraEvening)
    obj.lateNight = this.minToStr(lengthNight)
    obj.break = this.minToStr(lengthBreak)
    obj.length = this.minToStr(lengthWork)

    return obj
  }
}
