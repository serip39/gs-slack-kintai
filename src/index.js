import Slack from './slack'
import Spreadsheet from './spreadsheet'
import Moment from './moment'
import { setMsgForConfirmation, setInteractiveResponseMsg } from './message'

const spreadsheet = new Spreadsheet()
const slack = new Slack('test')
const moment = new Moment('09:30', '18:30', '22:00')

global.initialSetting = () => {
  spreadsheet.createTimesheet('seri')
}

global.test = () => {
  copyLogIfNeeded()
}

global.doPost = (e) => {
  // Interactive messagesの場合
  if (e.parameter.payload) {
    const payload = JSON.parse(e.parameter.payload)
    if (payload.type === 'interactive_message') {
      createlog(payload)
      payload.time = moment.getNow()
      spreadsheet.addLogForTimestamp(payload)
      return ContentService.createTextOutput(setInteractiveResponseMsg(payload))
    }
  }

  // EventAPIの場合
  const params = JSON.parse(e.postData.getDataAsString())
  createlog('params')
  if (params.type === 'url_verification') {
    return slack.verificationForEventAPI(params)
  } else if (params.type === 'event_callback') {
    if (params.event.bot_id) return
    const channel = params.event.channel
    const user = params.event.user
    const text = ''
    const attachments = setMsgForConfirmation(params.event.text)
    slack.postEphemeral(channel, text, user, attachments)
  }
}

global.timeDrivenFunction = () => {
  // 定期的に実行する処理を追加する
}

const copyLogIfNeeded = () => {
  const logsToCopy = spreadsheet.getLogsToCopy()
  if (!logsToCopy.length) return
  logsToCopy.forEach(log => {
    let user = spreadsheet.getUserData(log.user)
    let startDate = user.startedAt
    let numRow = moment.diff(startDate, log.time, 'days')
    log.time = moment.format(log.time, 'hh:mm')
    if (spreadsheet.copyLogToUserSheet(log, numRow)) {
      spreadsheet.updateLog(log.id + 1)
    }
  })
}

const createlog = (output) => {
  if (typeof output === 'object') {
    output = JSON.stringify(output)
  }
  const now = moment.getNow()
  spreadsheet.log([ now, output ])
}
