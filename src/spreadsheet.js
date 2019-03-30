import Date from './date'

const date = new Date()

export default class {
  constructor (id) {
    this.id = id
    this.target = SpreadsheetApp.openById(this.id)
    this._memberHead = ['No.', '氏名', 'slack名', 'slackID', '雇用形態', '勤務形態', '備考']
    this._timesheetHead = ['出勤時間', '退勤時間', '残業時間', '深夜時間', '休憩時間', '労働時間', '勤怠状況']
  }

  create (sheetName) {
    const spreadsheet = SpreadsheetApp.create(sheetName)
    this.id = spreadsheet.getId()
    return this.id
  }

  createTableHeaderColumns (sheet, array, startRow, startCol, color) {
    const columns = [array]
    const numRow = columns.length
    const numCol = columns[0].length
    sheet.getRange(startRow, startCol, numRow, numCol).setValues(columns)
    sheet.getRange(startRow, startCol, numRow, numCol).setBackground(color)
  }

  setAllData (sheet, datas, startRow, startCol) {
    const numRow = datas.length
    const numCol = datas[0].length
    return sheet.getRange(startRow + 1, startCol, numRow, numCol).setValues(datas)
  }

  getAllData (sheet, header, startRow, startCol) {
    const lastRow = sheet.getLastRow()
    const numRow = lastRow - startRow
    const numCol = header.length
    return sheet.getRange(startRow + 1, startCol, numRow, numCol).getValues()
  }

  initialSetting () {
    this.target.renameActiveSheet('_メンバー')
    const memberSheet = this.target.getActiveSheet()
    const header = this._memberHead
    const colorHeader = '#CCCCCC'
    this.createTableHeaderColumns(memberSheet, header, 1, 1, colorHeader)
    memberSheet.autoResizeColumns(1, 1)
    memberSheet.setColumnWidth(header.length, 400)
  }

  addSlackId (slackUsers) {
    const sheet = this.target.getSheetByName('_メンバー')
    const users = this.getAllData(sheet, this._memberHead, 1, 1)
    const slackNameIndex = this._memberHead.indexOf('slack名')
    const slackIdIndex = this._memberHead.indexOf('slackID')
    let shouldUpdated = false
    const updatedUsers = users.map(user => {
      if (!user[slackIdIndex]) {
        Logger.log(user[slackNameIndex])
        // Array.prototype.find() が GASのfind関数と競合して使えない
        for (let i = 0; i < slackUsers.length; i++) {
          if (slackUsers[i].name === user[slackNameIndex]) {
            user[slackIdIndex] = slackUsers[i].id
            shouldUpdated = true
            break
          }
        }
      }
      return user
    })

    if (shouldUpdated) {
      this.createlog(updatedUsers)
      this.setAllData(sheet, updatedUsers, 1, 1)
    }
  }

  createTimesheet (username) {
    const timeSheet = this.target.insertSheet(username)
    const header = this._timesheetHead
    const colorHeader = '#CCCCCC'
    this.createTableHeaderColumns(timeSheet, header, 25, 2, colorHeader)
    this.createCalender(timeSheet)
  }

  createCalender (timeSheet) {
    const calenderArray = date.createCalender('2019-02-01', '2019-04-30')
    const numRow = calenderArray.length
    const numCol = calenderArray[0].length
    timeSheet.getRange(26, 1, numRow, numCol).setValues(calenderArray)
  }

  addLogForTimestamp (payload) {
    const time = date.getNow()
    const user = payload.user.name
    const task = payload.callback_id
    const posted = 0
    const sheet = this.target.getSheetByName('_log')
    sheet.appendRow([time, user, task, posted])
  }

  transposeArray (matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]))
  }

  createlog (output) {
    if (typeof output === 'object') {
      output = JSON.stringify(output)
    }
    const sheet = this.target.getSheetByName('_dev')
    const now = date.getNow()
    sheet.appendRow([now, output])
  }
}
