export default class {
  constructor (name) {
    this.name = name
  }

  postSlack (params) {
    const url = 'https://slack.com/api/chat.postMessage'
    let data = {
      channel: params.event.channel,
      text: params.event.text
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
