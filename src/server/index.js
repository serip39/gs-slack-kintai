global.doPost = (e) => {
  // Interactive messagesの場合
  if (e.parameter.payload) {
    const payload = JSON.parse(e.parameter.payload)
    if (payload.type === 'block_actions') {
      if (payload.actions[0].action_id !== 'cancel') {
        const now = new Date()
        payload.time = datetimeFormat(now)
        addLogForTimestamp(payload)
      }
      postHTTP(payload.response_url, setInteractiveResponseMsg(payload))
    }
    return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
  }

  // EventAPIの場合
  const params = JSON.parse(e.postData.getDataAsString())
  if (params.type === 'url_verification') {
    const data = {
      challenge: params.challenge
    }
    let response = ContentService.createTextOutput()
    response.setContent(JSON.stringify(data))
    response.setMimeType(ContentService.MimeType.JSON)
    return response
  } else if (params.type === 'event_callback') {
    if (!params.event.bot_id) {
      const channel = params.event.channel
      const text = ''
      const user = params.event.user
      const blocks = setMsgToUser(params.event.text)
      // 何も条件に該当しなかった場合には、何もしない
      if (!blocks) return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
      slackPostEphemeral(channel, text, user, blocks)
    }
    return ContentService.createTextOutput() // HTTP_200OK responce（3s以内にする必要あり）
  }
}

const datetimeFormat = (date) => {
  let format = 'YYYY-MM-DD hh:mm:ss'
  format = format.replace(/YYYY/g, date.getFullYear())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  return format
}

const addLogForTimestamp = (payload) => {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName('_log')
  const LastRow = sheet.getLastRow()
  const rowToAdd = LastRow + 1
  const searchId = `=IF(AND(D${rowToAdd}="clockOut", TIMEVALUE(B${rowToAdd}) < TIMEVALUE("12:00:00")), DATEVALUE(TEXT(B${rowToAdd}, "YYYY/MM/DD"))-1&"_"&C${rowToAdd}&"_"&D${rowToAdd}, DATEVALUE(TEXT(B${rowToAdd}, "YYYY/MM/DD"))&"_"&C${rowToAdd}&"_"&D${rowToAdd})`
  const time = payload.time
  const user = payload.user.name
  const task = payload.actions[0].action_id
  sheet.appendRow([searchId, time, user, task])
}

const postHTTP = (url, text) => {
  const data = {
    text
  }
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  }
  UrlFetchApp.fetch(url, options)
}

const setInteractiveResponseMsg = (payload) => {
  const action = payload.actions[0].action_id
  if (action === 'cancel') return '打刻をキャンセルしました'
  const greet = greeting(action)
  const time = strJP(action) + '時間'
  return `${greet}（${time}：<!date^${Math.round(payload.actions[0].action_ts)}^{date_num} {time}| 1989-01-01 00:00 AM PST>）`
}

const greeting = (action) => {
  switch (action) {
    case 'clockIn':
      return 'おはようございます！'
    case 'clockOut':
      return 'お疲れ様でした！'
    case 'breakStart':
      return 'ごゆっくり〜！'
    case 'breakEnd':
      return '気持ちを切り替えていきましょ！'
    default:
      return 'error'
  }
}

const strJP = (str) => {
  switch (str) {
    case 'clockIn':
      return '出勤'
    case 'clockOut':
      return '退勤'
    case 'breakStart':
      return '休憩開始'
    case 'breakEnd':
      return '休憩終了'
    default:
      return 'error'
  }
}

const setMsgToUser = (msg) => {
  const rules = {
    clockIn: /(おは|おっは|hello|morning|出勤)/,
    clockOut: /(おつ|さらば|お先|お疲|帰|乙|night|退勤)/,
    breakStart: /(外出|ランチ|離席|離脱|休憩(?!終))/,
    breakEnd: /(戻り|復帰|復活|休憩終)/
  }
  let userAction = ''
  Object.keys(rules).forEach(action => {
    if (msg.match(rules[action])) {
      userAction = action
    }
  })
  if (!userAction) return null
  return msgForConfirmation(userAction)
}

const msgForConfirmation = (action) => {
  const textAction = strJP(action)
  return [
    {
      'type': 'section',
      'text': {
        'type': 'plain_text',
        'text': `${textAction}しますか？`,
        'emoji': true
      }
    },
    {
      'type': 'actions',
      'elements': [
        {
          'type': 'button',
          'text': {
            'type': 'plain_text',
            'emoji': true,
            'text': `${textAction}`
          },
          'action_id': `${action}`,
          'style': 'primary'
        },
        {
          'type': 'button',
          'text': {
            'type': 'plain_text',
            'emoji': true,
            'text': 'キャンセル'
          },
          'action_id': `cancel`
        }
      ]
    }
  ]
}

const slackPostEphemeral = (channel, text, user, blocks) => {
  const url = 'https://slack.com/api/chat.postEphemeral'
  const data = {
    channel,
    text,
    user,
    blocks
  }
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + process.env.SLACK_BOT_OAUTH_TOKEN
    },
    payload: JSON.stringify(data)
  }
  UrlFetchApp.fetch(url, options)
}
