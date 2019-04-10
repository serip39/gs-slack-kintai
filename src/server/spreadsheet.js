import moment from './moment'

export default class {
  constructor () {
    this.target = SpreadsheetApp.getActiveSpreadsheet()
    this._memberHead = ['id', 'name', 'employment', 'workStyle', 'email', 'slackName', 'slackId', 'startedAt', 'endedAt', 'memo']
    this._timesheetHead = ['date', 'clockIn', 'clockOut', 'breakStart', 'breakEnd', 'extra', 'lateNight', 'break', 'length', 'status']
    this._logHead = ['id', 'time', 'user', 'action', 'posted']
    this._numRowStartRecord = 23
  }

  // Array.prototype.find() が動かないので自作
  findData (arrObj, key, val) {
    for (let i = 0; i < arrObj.length; i++) {
      if (arrObj[i][key] === val) {
        return arrObj[i]
      }
    }
  }

  getTimeSetting () {
    const sheet = this.target.getSheetByName('_setting')
    const numRow = sheet.getLastRow()
    const numCol = sheet.getLastColumn()
    const matrix = sheet.getRange(1, 1, numRow, numCol).getValues()
    const header = matrix.shift()
    return this.matrixToArrObj(matrix, header)[0]
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
    const matrix = sheet.getRange(startRow + 1, startCol, numRow, numCol).getValues()
    return this.matrixToArrObj(matrix, header)
  }

  getRowData (sheet, header, numRow) {
    const numCol = header.length
    const multiArr = sheet.getRange(numRow, 1, 1, numCol).getValues()
    return this.matrixToArrObj(multiArr, header)[0]
  }

  setRowData (sheet, header, numRow, obj) {
    const numCol = header.length
    const data = Object.keys(obj).map(key => obj[key])
    return sheet.getRange(numRow, 1, 1, numCol).setValues([ data ])
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
    const calenderArray = moment.createCalender('2019-02-01', '2019-04-30')
    const numRow = calenderArray.length
    const numCol = calenderArray[0].length
    timeSheet.getRange(26, 1, numRow, numCol).setValues(calenderArray)
  }

  addLogForTimestamp (payload) {
    const id = '=ROW() - 1'
    const time = payload.time
    const user = payload.user.name
    const task = payload.callback_id
    const posted = 0
    const sheet = this.target.getSheetByName('_log')
    sheet.appendRow([id, time, user, task, posted])
  }

  getLogsToCopy () {
    const sheet = this.target.getSheetByName('_log')
    const logs = this.getAllData(sheet, this._logHead, 1, 1)
    return logs.filter(data => !data.posted)
  }

  getUserData (userName) {
    const sheet = this.target.getSheetByName('_member')
    const users = this.getAllData(sheet, this._memberHead, 1, 1)
    return this.findData(users, 'slackName', userName)
  }

  copyLogToUserSheet (data, numRow) {
    try {
      const sheet = this.target.getSheetByName(data.user)
      numRow += this._numRowStartRecord
      const numCol = this._timesheetHead.indexOf(data.action) + 1
      sheet.getRange(numRow, numCol).setValue(data.time)
      return true
    } catch (err) {
      return false
    }
  }

  getRowDataInUserSheet (userName, numRow) {
    const sheet = this.target.getSheetByName(userName)
    numRow += this._numRowStartRecord
    return this.getRowData(sheet, this._timesheetHead, numRow)
  }

  updateRowDataInUserSheet (userName, numRow, data) {
    const sheet = this.target.getSheetByName(userName)
    numRow += this._numRowStartRecord
    return this.setRowData(sheet, this._timesheetHead, numRow, data)
  }

  updateLog (numRow) {
    const sheet = this.target.getSheetByName('_log')
    const numCol = this._logHead.indexOf('posted') + 1
    sheet.getRange(numRow, numCol).setValue(1)
  }

  getUserRecords (userName) {
    const sheet = this.target.getSheetByName(userName)
    return this.getAllData(sheet, this._timesheetHead, 22, 1)
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

  log (data) {
    const sheet = this.target.getSheetByName('_dev')
    sheet.appendRow(data)
  }
}
