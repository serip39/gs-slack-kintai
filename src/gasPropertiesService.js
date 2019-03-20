export default class {
  constructor () {
    this.properties = PropertiesService.getScriptProperties()
  }

  get (key) {
    return this.properties.getProperty(key)
  }

  set (key, val) {
    this.properties.setProperty(key, val)
    return val
  }

  init () {
    this.properties.deleteAllProperties()
  }
}
