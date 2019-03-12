import Slack from './slack'

global.test = () => {
  const slack = new Slack('test')
  Logger.log(slack)
  slack.test()
}