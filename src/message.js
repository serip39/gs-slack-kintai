const commands = {
  begin: /(おは|おっは|hello|morning|出勤)/,
  finish: /(おつ|さらば|お先|お疲|帰|乙|night|退勤)/,
  breakStart: /(外出|ランチ|離脱|休憩(?!終))/,
  breakFinish: /(戻り|復帰|休憩終)/
}

const strJP = (str) => {
  switch (str) {
    case 'begin':
      return '出勤'
    case 'finish':
      return '退勤'
    case 'breakStart':
      return '休憩開始'
    case 'breakFinish':
      return '休憩終了'
    default:
      return 'error'
  }
}

const message = (action) => {
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

const setReplyMsg = (msg) => {
  Logger.log(msg)
  let userAction = ''
  Object.keys(commands).forEach(action => {
    if (msg.match(commands[action])) {
      userAction = action
    }
  })
  return message(userAction)
}

export { setReplyMsg }
