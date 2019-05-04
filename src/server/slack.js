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
        name: user.name,
        email: user.profile.email,
        tel: user.profile.phone
      }
    })
  }

  getIMList () {
    const url = 'https://slack.com/api/im.list?token=' + process.env.SLACK_BOT_OAUTH_TOKEN
    const response = UrlFetchApp.fetch(url)
    const data = JSON.parse(response.getContentText())
    return data.ims.map(ims => {
      return {
        id: ims.id,
        slackId: ims.user
      }
    })
  }

  postMessage (channel, text, blocks) {
    const url = 'https://slack.com/api/chat.postMessage'
    const data = {
      channel,
      text,
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

  postEphemeral (channel, text, user, blocks) {
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

  post (url, text) {
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
