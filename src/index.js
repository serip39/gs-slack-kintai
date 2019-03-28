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
  const slackUsers = slack.getUserList()
  spreadsheet.addSlackId(slackUsers)
}

global.doPost = (e) => {
  // Interactive messagesの場合
  if (e.parameter.payload) {
    const payload = JSON.parse(e.parameter.payload)
    if (payload.type === 'interactive_message') {
      spreadsheet.createlog(payload)
      let message = ''
      if (payload.actions[0].value === 'yes') {
        message = `おはようございます！　出勤時間：<!date^${Math.round(payload.action_ts)}^{date_num} {time}| 1989-01-01 00:00 AM PST>` // eslint-disable-line
      }
      if (payload.actions[0].value === 'cancel') {
        message = '打刻をキャンセルしました'
      }
      return ContentService.createTextOutput(message)
    }
  }

  // EventAPIの場合
  const params = JSON.parse(e.postData.getDataAsString())
  spreadsheet.createlog(params)
  if (params.type === 'url_verification') {
    slack.verificationForEventAPI(params)
  } else if (params.type === 'event_callback') {
    if (params.event.bot_id) return
    slack.postEphemeral(params)
  }
}
