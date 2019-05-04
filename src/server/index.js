import Slack from './slack'
import Spreadsheet from './spreadsheet'
import Moment from './moment'
import { setMsgToUser, setInteractiveResponseMsg, setApproveMsg } from './message'

const spreadsheet = new Spreadsheet()
const slack = new Slack('test')
const moment = new Moment()

global.initialSetting = () => {
  // slackのID取得
  const slackUsers = slack.getUserList()
  spreadsheet.addSlackId(slackUsers)
  // 各人のシート作成
  const calender = moment.createCalender('2019/01/01', '2019/12/31')
  const users = spreadsheet.getAllUsers()
  createlog(users)
  for (let i = 0; i < users.length; i++) {
    spreadsheet.createTimesheet(users[i], calender)
  }
}

global.setSlackIM = () => {
  const IMList = slack.getIMList()
  Logger.log(IMList)
  spreadsheet.addSlackIM(IMList)
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
    if (payload.type === 'block_actions') {
      if (payload.actions[0].action_id !== 'cancel') {
        payload.time = moment.getNow()
        spreadsheet.addLogForTimestamp(payload)
      }
      slack.post(payload.response_url, setInteractiveResponseMsg(payload))
    }
    return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
  }

  // EventAPIの場合
  const params = JSON.parse(e.postData.getDataAsString())
  // createlog(params)
  if (params.type === 'url_verification') {
    return slack.verificationForEventAPI(params)
  } else if (params.type === 'event_callback') {
    if (!params.event.bot_id) {
      const isIM = params.event.channel_type === 'im'
      const channel = params.event.channel
      const text = ''
      const user = params.event.user
      const blocks = setMsgToUser(isIM, params.event.text, params.event.user)
      // 何も条件に該当しなかった場合には、何もしない
      if (!blocks) return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
      if (isIM) {
        slack.postMessage(channel, text, blocks)
      } else {
        slack.postEphemeral(channel, text, user, blocks)
      }
    }
    return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
  }
}

global.timeDrivenFunction = () => {
  // 定期的に実行する処理を追加する
}

global.getTimeRecords = (userName, fromDate, toDate) => {
  const data = spreadsheet.getUserRecords(userName)
  const dataPeriod = data.filter(log => moment.isBetween(log.date, fromDate, toDate))
  return dataPeriod.map(obj => {
    let clockIn = new Date(obj.clockIn)
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) === '[object Date]') {
        obj[key] = moment.formatStr(key, obj[key], clockIn)
      }
    })
    return obj
  })
}

global.getUserData = userId => {
  const userData = spreadsheet.getUserData('slackId', userId)
  Object.keys(userData).forEach(key => {
    if (Object.prototype.toString.call(userData[key]) === '[object Date]') {
      userData[key] = moment.formatStr(key, userData[key])
    }
  })
  return userData
}

global.postApply = data => {
  data.time = moment.getNow()
  spreadsheet.createApply(data)
  return ContentService.createTextOutput()
}

const copyLogIfNeeded = () => {
  const logsToCopy = spreadsheet.getLogsToCopy()
  if (!logsToCopy.length) return
  logsToCopy.forEach(log => {
    let user = spreadsheet.getUserData('slackName', log.user)
    let startDate = user.startedAt
    let numRow = moment.diff(startDate, log.time, 'days')
    // clockIn以外は日付を超えたとしても、clockInした日付で記録する
    while (log.action !== 'clockIn' && !spreadsheet.hasClockIn(log.user, numRow)) {
      numRow--
    }
    if (spreadsheet.copyLogToUserSheet(log, numRow)) {
      spreadsheet.updateLog(log.id + 1)
    }
    if (log.action === 'clockOut') {
      const rowData = spreadsheet.getRowDataInUserSheet(log.user, numRow)
      const result = moment.calLength(rowData)
      spreadsheet.updateRowDataInUserSheet(log.user, numRow, result)
      result.clockOut = moment.formatStr('clockOut', result.clockOut, result.clockIn)
      result.clockIn = moment.formatStr('clockIn', result.clockIn)
      const channel = 'DHACEP005'
      const text = ''
      const blocks = setApproveMsg(user, result, moment.format(result.date, 'YYYY-MM-DD'))
      slack.postMessage(channel, text, blocks)
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

// データ移行用の関数
global.copyOldDate = () => {
  // const users = spreadsheet.getAllUsers()
  const users = ['hashimoto', 'kawase', 'tamaki']
  users.forEach(userName => {
    const oldSpread = SpreadsheetApp.openById(process.env.SPREAD_ID)
    const sheet = oldSpread.getSheetByName(userName)
    // 2019/1/1が196行目なのでそこからデータを取得する
    const matrix = sheet.getRange(196, 1, 102, 3).getValues()
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i][1]) spreadsheet.addLogForOldTimestamp(matrix[i][1], userName, 'clockIn')
      if (matrix[i][2]) spreadsheet.addLogForOldTimestamp(matrix[i][2], userName, 'clockOut')
    }
  })
}
