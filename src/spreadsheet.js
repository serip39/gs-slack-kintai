import Date from './date'

const date = new Date()

export default class {
  constructor (id) {
    this.id = id
    this.target = SpreadsheetApp.openById(this.id)
    this._memberHead = ['No.', '氏名', '雇用形態', '勤務形態', 'slack名', 'slackId', '利用開始日', '利用終了日', '備考']
    this._timesheetHead = ['date', 'clockIn', 'clockOut', 'breakStart', 'breakEnd', 'extra', 'lateNight', 'break', 'length', 'status']
    this._logHead = ['id', 'time', 'user', 'action', 'posted']
    this._numRowStartRecord = 26
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

  getRowData (sheet, header, numRow) {
    const numCol = header.length
    const multiArr = sheet.getRange(numRow, 1, 1, numCol).getValues()
    return this.matrixToArrObj(multiArr, header)[0]
  }

  setRowData (sheet, header, numRow, obj) {
    const numCol = header.length
    const row = Object.keys(obj).map(key => obj[key])
    return sheet.getRange(numRow, 1, 1, numCol).setValues([ row ])
  }

  initialSetting () {
    this.target.renameActiveSheet('_member')
    const memberSheet = this.target.getActiveSheet()
    const header = this._memberHead
    const colorHeader = '#CCCCCC'
    this.createTableHeaderColumns(memberSheet, header, 1, 1, colorHeader)
    memberSheet.autoResizeColumns(1, 1)
    memberSheet.setColumnWidth(header.length, 400)
  }

  addSlackId (slackUsers) {
    const sheet = this.target.getSheetByName('_member')
    const users = this.getAllData(sheet, this._memberHead, 1, 1)
    const slackNameIndex = this._memberHead.indexOf('slack名')
    const slackIdIndex = this._memberHead.indexOf('slackId')
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
    this.createTableHeaderColumns(timeSheet, header, 25, 1, colorHeader)
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

  postToEachUserSheet () {
    const sheet = this.target.getSheetByName('_log')
    const logs = this.getAllData(sheet, this._logHead, 1, 1)
    const data = this.matrixToArrObj(logs, this._logHead)
    const logToPost = data.filter(data => !data.posted)
    logToPost.forEach(data => {
      this.postUserSheet(data)
      data.posted = 1
      this.setRowData(sheet, this._logHead, data.id + 1, data)
    })
  }

  actionToColumn (action) {
    switch (action) {
      case 'begin':
        return '出勤時間'
      case 'finish':
        return '退勤時間'
      case 'breakStart':
        return '休憩開始時間'
      case 'breakFinish':
        return '休憩終了終了時間'
      default:
        return 'error'
    }
  }

  postUserSheet (data) {
    Logger.log(data)
    const sheet = this.target.getSheetByName(data.user)
    const startDate = sheet.getRange('G2').getValue()
    const updateData = date.formatDate(data.time, 'YYYY/MM/DD')
    const dayDiff = date.diff(startDate, updateData)
    const row = this._numRowStartRecord + dayDiff
    const rowData = this.getRowData(sheet, this._timesheetHead, row)
    rowData[data.action] = date.formatDate(data.time, 'hh:mm')
    return this.setRowData(sheet, this._timesheetHead, row, rowData)
  }

  matrixToArrObj (matrix, header) {
    if (matrix[0].length !== header.length) return false
    return matrix.map(row => {
      return header.reduce((acc, key, index) => {
        acc[key] = row[index]
        return acc
      }, {})
    })
  }

  arrObjToMatrix (arrObj) {
    return arrObj.map(rowObj => {
      return Object.keys(rowObj).map(key => rowObj[key])
    })
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
