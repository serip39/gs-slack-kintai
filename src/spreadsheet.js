export default class {
  constructor (id) {
    this.id = id
  }

  create (sheetName) {
    var spreadsheet = SpreadsheetApp.create(sheetName)
    this.id = spreadsheet.getId()
    return this.id
  }
}
