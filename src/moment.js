export default class {
  constructor (start, end, night) {
    this.startTime = start
    this.endTime = end
    this.nightTime = night
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
    return this.format(now, format)
  }

  format (date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss'
    format = format.replace(/YYYY/g, date.getFullYear())
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
    return format
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

  minToStr (min) {
    const hour = min / 60
    min %= 60
    return hour + ':' + min
  }

  calLength (obj) {
    const clockIn = [obj.date, obj.clockIn].join(' ')
    const clockOut = [obj.date, obj.clockOut].join(' ')
    const breakStart = [obj.date, obj.breakStart].join(' ')
    const breakEnd = [obj.date, obj.breakEnd].join(' ')

    let lengthWork = this.diff(clockIn, clockOut, 'minutes')
    let lengthBreak = this.diff(breakStart, breakEnd, 'minutes')

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
  }
}
