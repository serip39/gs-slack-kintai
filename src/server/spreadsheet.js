export default class {
  constructor () {
    this.target = SpreadsheetApp.getActiveSpreadsheet()
    this._memberHead = ['id', 'name', 'employment', 'department_id', 'email', 'tel', 'slackName', 'slackId', 'slackIM', 'startedAt', 'endedAt', 'memo']
    this._timesheetHead = ['date', 'clockIn', 'clockOut', 'breakStart', 'breakEnd', 'extra', 'lateNight', 'break', 'length', 'status', 'memo', 'approval']
    this._logHead = ['id', 'time', 'user', 'action', 'posted']
    this._departmentHead = ['id', 'department', 'manager_id']
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

  getAllUsers () {
    const sheet = this.target.getSheetByName('_member')
    const users = this.getAllData(sheet, this._memberHead, 1, 1)
    return users.map(user => user.slackName)
  }

  addSlackId (slackUsers) {
    const sheet = this.target.getSheetByName('_member')
    const users = this.getAllData(sheet, this._memberHead, 1, 1)
    let shouldUpdated = false
    const updatedUsers = users.map(user => {
      if (!user.slackId) {
        for (let i = 0; i < slackUsers.length; i++) {
          if (slackUsers[i].email === user.email) {
            user.slackId = slackUsers[i].id
            user.tel = slackUsers[i].tel
            shouldUpdated = true
            break
          }
        }
      }
      return user
    })

    if (shouldUpdated) {
      const matrix = this.arrObjToMatrix(updatedUsers)
      this.setAllData(sheet, matrix, 1, 1)
    }
  }

  addSlackIM (IMList) {
    const sheet = this.target.getSheetByName('_member')
    const users = this.getAllData(sheet, this._memberHead, 1, 1)
    let shouldUpdated = false
    const updatedUsers = users.map(user => {
      if (!user.slackIM) {
        for (let i = 0; i < IMList.length; i++) {
          if (IMList[i].slackId === user.slackId) {
            user.slackIM = IMList[i].id
            shouldUpdated = true
            break
          }
        }
      }
      return user
    })

    if (shouldUpdated) {
      const matrix = this.arrObjToMatrix(updatedUsers)
      this.setAllData(sheet, matrix, 1, 1)
    }
  }

  createTimesheet (username, calender) {
    const timeSheet = this.target.insertSheet(username)
    const header = this._timesheetHead
    const colorHeader = '#CCCCCC'
    this.createTableHeaderColumns(timeSheet, header, 22, 1, colorHeader)
    const numRow = calender.length
    const numCol = calender[0].length
    timeSheet.getRange(23, 1, numRow, numCol).setValues(calender)
  }

  createFormula (username, term) {
    const cols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
    const termLength = term.days.length - 1
    const firstCol = ['', '実働日数', '平日出勤日数', '休日出勤日数', '欠勤日数', '遅刻回数', '早退回数', '有休日数', '代休日数', '慶弔休暇日数', '実労働時間', '実残業時間', '実深夜時間', '平日労働時間', '平日残業時間', '平日深夜時間', '休日労働時間', '休日残業時間', '休日深夜時間']
    const secondCol = ['合計']
    for (let i = 1; i < firstCol.length; i++) {
      let num = i + 1
      secondCol.push(`=SUM(C${num}:${cols[termLength]}${num})`)
    }
    let matrix = [firstCol, secondCol]
    let month = term.start
    let startRow = this._numRowStartRecord
    for (let i = 0; i < term.days.length; i++) {
      let endRow = startRow + term.days[i] - 1
      let extra = `F${startRow}:F${endRow}`
      let lateNight = `G${startRow}:G${endRow}`
      let length = `I${startRow}:I${endRow}`
      let status = `J${startRow}:J${endRow}`
      const data = [
        month,
        `=SUM(${cols[i]}3:${cols[i]}4)`,
        `=COUNT(${length}) - COUNTIF(${status}, "休日出勤*")`,
        `=COUNTIF(${status}, "休日出勤") + COUNTIF(${status}, "休日出勤-半日") * 0.5`,
        `=COUNTIF(${status}, "*欠勤*")`,
        `=COUNTIF(${status}, "*遅刻*")`,
        `=COUNTIF(${status}, "*早退*")`,
        `=COUNTIF(${status}, "有休") + COUNTIF(${status}, "有休-午?") * 0.5`,
        `=COUNTIF(${status}, "代休") + COUNTIF(${status}, "代休-午?") * 0.5`,
        `=COUNTIF(${status}, "慶弔休暇") + COUNTIF(${status}, "慶弔休暇-午?") * 0.5`,
        `=SUM(${length})`,
        `=SUM(${extra})`,
        `=SUM(${lateNight})`,
        `=${cols[i]}11-${cols[i]}17`,
        `=${cols[i]}12-${cols[i]}18`,
        `=${cols[i]}13-${cols[i]}19`,
        `=SUMIF(${status}, "休日出勤*" ,${length})`,
        `=SUMIF(${status}, "休日出勤*" ,${extra})`,
        `=SUMIF(${status}, "休日出勤*" ,${lateNight})`
      ]
      matrix.push(data)
      startRow = endRow + 1
      month++
    }

    matrix = this.transposeArray(matrix)

    const numRow = matrix.length
    const numCol = matrix[0].length
    const sheet = this.target.getSheetByName(username)
    sheet.getRange(1, 1, numRow, numCol).setValues(matrix)

    // 時間の表示形式を設定
    sheet.getRange(11, 2, 9, numCol - 1).setNumberFormat('[h]:mm:ss')
  }

  addLogForTimestamp (payload) {
    const id = '=ROW() - 1'
    const time = payload.time
    const user = payload.user.name
    const task = payload.actions[0].action_id
    const posted = 0
    const sheet = this.target.getSheetByName('_log')
    sheet.appendRow([id, time, user, task, posted])
  }

  addLogForOldTimestamp (time, user, task) {
    const id = '=ROW() - 1'
    const posted = 0
    const sheet = this.target.getSheetByName('_logOld')
    sheet.appendRow([id, time, user, task, posted])
  }

  getLogsToCopy () {
    const sheet = this.target.getSheetByName('_log')
    // const sheet = this.target.getSheetByName('_logOld')
    const logs = this.getAllData(sheet, this._logHead, 1, 1)
    return logs.filter(data => !data.posted)
  }

  getUserData (key, val) {
    const sheet = this.target.getSheetByName('_member')
    const users = this.getAllData(sheet, this._memberHead, 1, 1)
    return this.findData(users, key, val)
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

  hasClockIn (userName, numRow) {
    const sheet = this.target.getSheetByName(userName)
    numRow += this._numRowStartRecord
    const numCol = this._timesheetHead.indexOf('clockIn') + 1
    return sheet.getRange(numRow, numCol).getValue()
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
    // const sheet = this.target.getSheetByName('_logOld')
    const numCol = this._logHead.indexOf('posted') + 1
    sheet.getRange(numRow, numCol).setValue(1)
  }

  getUserRecords (userName) {
    const sheet = this.target.getSheetByName(userName)
    return this.getAllData(sheet, this._timesheetHead, 22, 1)
  }

  createApply (payload) {
    const id = '=ROW() - 1'
    const time = payload.time
    const user = payload.user
    const task = payload.task
    const from = payload.from
    const to = payload.to
    const reason = payload.reason
    const approval = 0
    const posted = 0
    const sheet = this.target.getSheetByName('_apply')
    sheet.appendRow([id, time, user, task, from, to, reason, approval, posted])
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
