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

  postEphemeral (channel, text, user, blocks) {
    const url = 'https://slack.com/api/chat.postEphemeral'
    const data = {
      channel,
      text,
      user,
      blocks
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

  post (url, text) {
    const data = {
      text
    }
    const options = {
      'method': 'POST',
      'contentType': 'application/json',
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
