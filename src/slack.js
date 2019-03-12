export default class {
  constructor(name) {
    this.name = name
  }

  postSlack(text) {
    var url = "https://hooks.slack.com/services/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";
    var options = {
      "method" : "POST",
      "headers": {"Content-type": "application/json"},
      "payload" : '{"text":"' + text + '"}'
    };
    UrlFetchApp.fetch(url, options)
  }

  test() {
    this.postSlack("これはテストです")
  }

  doPost(e) {
    if (e.parameter.user_name === "slackbot") return
    var message = "こんにちは " + e.parameter.user_name + "さん"
    this.postSlack(message)
  }
}
