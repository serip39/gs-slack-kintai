const commands = {
  clockIn: /(おは|おっは|hello|morning|出勤)/,
  clockOut: /(おつ|さらば|お先|お疲|帰|乙|night|退勤)/,
  breakStart: /(外出|ランチ|離脱|休憩(?!終))/,
  breakEnd: /(戻り|復帰|休憩終)/,
  applyVacation: /(休暇|有休|代休).*(申請)/
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

const msgApply = [
  {
    'type': 'section',
    'text': {
      'type': 'plain_text',
      'text': '申請を開始しますか？',
      'emoji': true
    }
  },
  {
    'type': 'section',
    'text': {
      'type': 'mrkdwn',
      'text': '申請したい内容を選択してください'
    },
    'accessory': {
      'action_id': 'apply',
      'type': 'static_select',
      'placeholder': {
        'type': 'plain_text',
        'text': '選択してください',
        'emoji': true
      },
      'options': [
        {
          'text': {
            'type': 'plain_text',
            'text': '休暇申請',
            'emoji': true
          },
          'value': 'vacation'
        },
        {
          'text': {
            'type': 'plain_text',
            'text': '残業申請',
            'emoji': true
          },
          'value': 'overwork'
        },
        {
          'text': {
            'type': 'plain_text',
            'text': '遅刻申請',
            'emoji': true
          },
          'value': 'lateIn'
        },
        {
          'text': {
            'type': 'plain_text',
            'text': '早退申請',
            'emoji': true
          },
          'value': 'earlyOut'
        }
      ]
    }
  }
]

const setMsgForConfirmation = (msg) => {
  let userAction = ''
  Object.keys(commands).forEach(action => {
    if (msg.match(commands[action])) {
      userAction = action
    }
  })
  if (userAction === 'applyVacation') return msgApply
  return msgForConfirmation(userAction)
}

const setInteractiveResponseMsg = (payload) => {
  const action = payload.actions[0].action_id
  if (action === 'cancel') return '打刻をキャンセルしました'
  const greet = greeting(action)
  const time = strJP(action) + '時間'
  return `${greet}（${time}：<!date^${Math.round(payload.actions[0].action_ts)}^{date_num} {time}| 1989-01-01 00:00 AM PST>）`
}

export { setMsgForConfirmation, setInteractiveResponseMsg }
