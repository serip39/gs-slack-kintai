const commands = {
  clockIn: /(おは|おっは|hello|morning|出勤)/,
  clockOut: /(おつ|さらば|お先|お疲|帰|乙|night|退勤)/,
  breakStart: /(外出|ランチ|離脱|休憩(?!終))/,
  breakEnd: /(戻り|復帰|休憩終)/
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

const msgForConfirmation = (action) => {
  const textAction = strJP(action)
  return [
    {
      text: `${textAction}しますか？`,
      callback_id: `${action}`,
      color: '#3AA3E3',
      attachment_type: 'default',
      actions: [
        {
          name: `${action}`,
          text: `${textAction}`,
          style: 'primary',
          type: 'button',
          value: 'true'
        },
        {
          name: `${action}`,
          text: 'キャンセル',
          type: 'button',
          value: 'false'
        }
      ]
    }
  ]
}

const setMsgForConfirmation = (msg) => {
  Logger.log(msg)
  let userAction = ''
  Object.keys(commands).forEach(action => {
    if (msg.match(commands[action])) {
      userAction = action
    }
  })
  return msgForConfirmation(userAction)
}

const setInteractiveResponseMsg = (payload) => {
  if (payload.actions[0].value === 'false') return '打刻をキャンセルしました'
  const greet = greeting(payload.callback_id)
  const time = strJP(payload.callback_id) + '時間'
  return `${greet}（${time}：<!date^${Math.round(payload.action_ts)}^{date_num} {time}| 1989-01-01 00:00 AM PST>）`
}

export { setMsgForConfirmation, setInteractiveResponseMsg }
