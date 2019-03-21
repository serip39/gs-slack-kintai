import Slack from './slack'
import GASPropertiesService from './gasPropertiesService'
import Spreadsheet from './spreadsheet'

const globalSettings = new GASPropertiesService()
const spreadsheet = new Spreadsheet(globalSettings.get('spreadsheet'))
const slack = new Slack('test')

global.initialSetting = () => {
  if (!spreadsheet.id) {
    const spreadsheetId = spreadsheet.create('Kintai-Timesheets')
    globalSettings.set('spreadsheet', spreadsheetId)
  }
  spreadsheet.createTimesheet('seri')
}

global.test = () => {
  Logger.log(slack)
  slack.postSlack('これはテストです')
}

global.doPost = (e) => {
  Logger.log(slack)
  if (e.parameter.user_name === 'slackbot') return
  let message = 'こんにちは ' + e.parameter.user_name + 'さん'
  slack.postSlack(message)
}
