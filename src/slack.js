export default class {
  constructor (name) {
    this.name = name
  }

  getUserList () {
    const url = 'https://slack.com/api/users.list?token=' + process.env.SLACK_BOT_OAUTH_TOKEN
    const response = UrlFetchApp.fetch(url)
    const data = JSON.parse(response.getContentText())
    return data.members.map(user => {
      return {
        id: user.id,
        name: user.name
      }
    })
  }

  checkIn (time) {
    return [
      {
        text: `出勤しますか？`,
        callback_id: 'check-in',
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          {
            name: 'checkIn',
            text: '　　　出　　勤　　　',
            style: 'primary',
            type: 'button',
            value: 'yes'
          },
          {
            name: 'checkIn',
            text: 'キャンセル',
            type: 'button',
            value: 'cancel'
          }
        ]
      }
    ]
  }

  postMessage (params) {
    const url = 'https://slack.com/api/chat.postMessage'
    let data = {
      channel: params.event.channel,
      text: params.event.text,
      attachments: this.checkIn()
    }
    const options = {
      'method': 'POST',
      'contentType': 'application/json',
      'headers': {
        'Authorization': 'Bearer ' + process.env.SLACK_BOT_OAUTH_TOKEN
      },
      'payload': JSON.stringify(data)
    }
    UrlFetchApp.fetch(url, options)
  }

  postEphemeral (params) {
    const url = 'https://slack.com/api/chat.postEphemeral'
    let data = {
      channel: params.event.channel,
      text: '',
      user: params.event.user,
      attachments: this.checkIn(params.event_time)
    }
    const options = {
      'method': 'POST',
      'contentType': 'application/json',
      'headers': {
        'Authorization': 'Bearer ' + process.env.SLACK_BOT_OAUTH_TOKEN
      },
      'payload': JSON.stringify(data)
    }
    UrlFetchApp.fetch(url, options)
  }

  verificationForEventAPI (params) {
    const data = {
      challenge: params.challenge
    }
    let response = ContentService.createTextOutput()
    response.setContent(JSON.stringify(data))
    response.setMimeType(ContentService.MimeType.JSON)
    return response
  }
}
