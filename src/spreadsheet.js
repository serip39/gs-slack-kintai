import Date from './date'

const date = new Date()

export default class {
  constructor (id) {
    this.id = id
    this.target = SpreadsheetApp.openById(this.id)
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

  initialSetting () {
    this.target.renameActiveSheet('_メンバー')
    const memberSheet = this.target.getActiveSheet()
    const header = ['No.', '氏名', 'slack名', '雇用形態', '勤務形態', '備考']
    const colorHeader = '#CCCCCC'
    this.createTableHeaderColumns(memberSheet, header, 1, 1, colorHeader)
    memberSheet.autoResizeColumns(1, 1)
    memberSheet.setColumnWidth(header.length, 400)
  }

  createTimesheet (username) {
    const timeSheet = this.target.insertSheet(username)
    const header = ['出勤時間', '退勤時間', '残業時間', '深夜時間', '休憩時間', '労働時間', '勤怠状況']
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

  transposeArray (matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]))
  }

  createlog (text) {
    const sheet = this.target.getSheetByName('_log')
    const now = date.getNow()
    sheet.appendRow([now, text])
  }
}
