import Slack from './slack'
import GASPropertiesService from './gasPropertiesService'
import Spreadsheet from './spreadsheet'
import { setMsgForConfirmation, setInteractiveResponseMsg } from './message'

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
      spreadsheet.addLogForTimestamp(payload)
      return ContentService.createTextOutput(setInteractiveResponseMsg(payload))
    }
  }

  // EventAPIの場合
  const params = JSON.parse(e.postData.getDataAsString())
  spreadsheet.createlog(params)
  if (params.type === 'url_verification') {
    slack.verificationForEventAPI(params)
  } else if (params.type === 'event_callback') {
    if (params.event.bot_id) return
    const channel = params.event.channel
    const user = params.event.user
    const text = ''
    const attachments = setMsgForConfirmation(params.event.text)
    slack.postEphemeral(channel, text, user, attachments)
  }
}
