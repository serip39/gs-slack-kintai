export default class {
  createCalender (start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    let calenders = []
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) { // eslint-disable-line
      let cloneDate = this.formatDate(new Date(date.getTime()), 'YYYY/MM/DD')
      calenders.push([cloneDate])
    }
    return calenders
  }

  getNow (format) {
    const now = new Date()
    return this.formatDate(now, format)
  }

  formatDate (date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss'
    format = format.replace(/YYYY/g, date.getFullYear())
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
    return format
  }

  diff (date1Str, date2Str) {
    const date1 = new Date(date1Str)
    const date2 = new Date(date2Str)
    const msDiff = date2.getTime() - date1.getTime()
    // 1day = 24h × 60min × 60s × 1000ms
    return Math.floor(msDiff / (1000 * 60 * 60 * 24))
  }
}
