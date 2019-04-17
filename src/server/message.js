const commands = {
  clockIn: /(おは|おっは|hello|morning|出勤)/,
  clockOut: /(おつ|さらば|お先|お疲|帰|乙|night|退勤)/,
  breakStart: /(外出|ランチ|離席|離脱|休憩(?!終))/,
  breakEnd: /(戻り|復帰|復活|休憩終)/
}

const commandsForIM = {
  checkRecord: /(記録|詳細|過去|勤怠|record|確認)/,
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

const strJPForIM = (str) => {
  switch (str) {
    case 'checkRecord':
      return '勤怠管理記録'
    case 'applyVacation':
      return '休暇申請'
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

const msgURL = (action, userId) => {
  const type = strJPForIM(action)
  const url = process.env.APP_URL + '?userId=' + userId
  return [
    {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': `${type}は *<${url}|こちら>*`
      }
    }
  ]
}

const setApproveMsg = (user, result, date) => {
  return [
    {
      'type': 'section',
      'text': {
        'type': 'plain_text',
        'text': `勤怠承認依頼（${user.name}）`
      }
    },
    {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': `本日の勤務状況（${date}）\n*出勤時間:* ${result.clockIn}\n*退勤時間:* ${result.clockOut}\n*休憩時間:* ${result.break}\n*残業時間:* ${result.extra}\n*深夜残業時間:* ${result.lateNight}\n*勤務時間:* ${result.length}\n`
      }
    },
    // {
    //   'type': 'section',
    //   'text': {
    //     'type': 'mrkdwn',
    //     'text': `今月の勤務状況\n*残業時間:* ${user}\n*深夜残業時間:* ${user}\n*総勤務時間:* ${user}\n`
    //   }
    // },
    {
      'type': 'actions',
      'elements': [
        {
          'type': 'button',
          'text': {
            'type': 'plain_text',
            'emoji': true,
            'text': 'Approve'
          },
          'action_id': `${user.slackName}_${date}_approve`,
          'style': 'primary'
        },
        {
          'type': 'button',
          'text': {
            'type': 'plain_text',
            'emoji': true,
            'text': 'Deny'
          },
          'action_id': `${user.slackName}_${date}_deny`,
          'style': 'danger'
        }
      ]
    }
  ]
}

const setMsgToUser = (isIM, msg, userId) => {
  let userAction = ''
  const rules = isIM ? commandsForIM : commands
  Object.keys(rules).forEach(action => {
    if (msg.match(rules[action])) {
      userAction = action
    }
  })
  if (!userAction) return null
  return isIM ? msgURL(userAction, userId) : msgForConfirmation(userAction)
}

const setInteractiveResponseMsg = (payload) => {
  const action = payload.actions[0].action_id
  if (action === 'cancel') return '打刻をキャンセルしました'
  const greet = greeting(action)
  const time = strJP(action) + '時間'
  return `${greet}（${time}：<!date^${Math.round(payload.actions[0].action_ts)}^{date_num} {time}| 1989-01-01 00:00 AM PST>）`
}

export { setMsgToUser, setInteractiveResponseMsg, setApproveMsg }
