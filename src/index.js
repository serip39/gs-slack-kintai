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
  spreadsheet.createlog('test')
}

global.doPost = (e) => {
  const params = JSON.parse(e.postData.getDataAsString())
  spreadsheet.createlog(params)
  if (params.type === 'url_verification') {
    slack.verificationForEventAPI(params)
  } else if (params.type === 'event_callback') {
    if (params.event.bot_id) return
    slack.postSlack(params)
  }
}
