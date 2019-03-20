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

  initialSetting () {
    this.target.renameActiveSheet('_メンバー')
    const memberSheet = this.target.getActiveSheet()
    const columns = [
      ['No.', '氏名', 'slack名', '雇用形態', '勤務形態', '備考']
    ]
    const rows = columns.length
    const cols = columns[0].length
    memberSheet.getRange(1, 1, rows, cols).setValues(columns)
    memberSheet.getRange(1, 1, rows, cols).setBackground('#CCCCCC')
    memberSheet.autoResizeColumns(1, 1)
    memberSheet.setColumnWidth(cols, 400)
  }
}
