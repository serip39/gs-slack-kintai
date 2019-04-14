import Slack from './slack'
import Spreadsheet from './spreadsheet'
import Moment from './moment'
import { setMsgForConfirmation, setInteractiveResponseMsg } from './message'

const spreadsheet = new Spreadsheet()
const slack = new Slack('test')
const moment = new Moment()

global.initialSetting = () => {
  spreadsheet.createTimesheet('seri')
}

global.test = () => {
  copyLogIfNeeded()
}

global.doGet = () => {
  let htmlOutput = HtmlService.createTemplateFromFile('index').evaluate()
  htmlOutput.setTitle('勤怠管理')
  htmlOutput.addMetaTag('viewport', 'minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
  htmlOutput.addMetaTag('mobile-web-app-capable', 'yes')
  return htmlOutput
}

global.doPost = (e) => {
  // Interactive messagesの場合
  if (e.parameter.payload) {
    const payload = JSON.parse(e.parameter.payload)
    createlog(payload)
    if (payload.type === 'block_actions') {
      const actionType = payload.actions[0].action_id
      if (actionType === 'applyVacation') {
        return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
      } else {
        payload.time = moment.getNow()
        spreadsheet.addLogForTimestamp(payload)
        slack.post(payload.response_url, setInteractiveResponseMsg(payload))
      }
    }
    return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
  }

  // EventAPIの場合
  const params = JSON.parse(e.postData.getDataAsString())
  createlog(params)
  if (params.type === 'url_verification') {
    return slack.verificationForEventAPI(params)
  } else if (params.type === 'event_callback') {
    if (params.event.bot_id) return
    const channel = params.event.channel
    const user = params.event.user
    const text = ''
    const blocks = setMsgForConfirmation(params.event.text, params.event.user)
    slack.postEphemeral(channel, text, user, blocks)
    return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
  }
}

global.timeDrivenFunction = () => {
  // 定期的に実行する処理を追加する
}

global.getTimeRecords = (fromDate, toDate) => {
  const data = spreadsheet.getUserRecords('seri')
  const dataPeriod = data.filter(log => moment.isBetween(log.date, fromDate, toDate))
  return dataPeriod.map(obj => {
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) === '[object Date]') {
        obj[key] = moment.formatStr(key, obj[key])
      }
    })
    return obj
  })
}

global.getUserData = userId => {
  createlog(userId)
  const userData = spreadsheet.getUserData('slackId', userId)
  createlog(userData)
  Object.keys(userData).forEach(key => {
    if (Object.prototype.toString.call(userData[key]) === '[object Date]') {
      userData[key] = moment.formatStr(key, userData[key])
    }
  })
  createlog(userData)
  return userData
}

const copyLogIfNeeded = () => {
  const logsToCopy = spreadsheet.getLogsToCopy()
  if (!logsToCopy.length) return
  logsToCopy.forEach(log => {
    let user = spreadsheet.getUserData('slackName', log.user)
    let startDate = user.startedAt
    let numRow = moment.diff(startDate, log.time, 'days')
    if (spreadsheet.copyLogToUserSheet(log, numRow)) {
      spreadsheet.updateLog(log.id + 1)
    }
    if (log.action === 'clockOut') {
      const rowData = spreadsheet.getRowDataInUserSheet(log.user, numRow)
      const result = moment.calLength(rowData)
      spreadsheet.updateRowDataInUserSheet(log.user, numRow, result)
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
