import Slack from './slack'

const slack = new Slack('test')

global.test = () => {
  Logger.log(slack)
  slack.postSlack('これはテストです')
}

global.doPost = (e) => {
  Logger.log(slack)
  if (e.parameter.user_name === 'slackbot') return
  let message = 'こんにちは ' + e.parameter.user_name + 'さん'
  slack.postSlack(message)
}
