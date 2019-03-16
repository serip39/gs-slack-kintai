export default class {
  constructor (name) {
    this.name = name
  }

  postSlack (text) {
    const url = process.env.SLACK_BOT_WEBHOCKS_URL
    let data = { text }
    const options = {
      'method': 'POST',
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    }
    UrlFetchApp.fetch(url, options)
  }
}
