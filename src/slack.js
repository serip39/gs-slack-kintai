export default class {
  constructor (name) {
    this.name = name
  }

  postSlack (text) {
    const url = 'https://hooks.slack.com/services/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'
    let data = { text }
    const options = {
      'method': 'POST',
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    }
    UrlFetchApp.fetch(url, options)
  }
}
