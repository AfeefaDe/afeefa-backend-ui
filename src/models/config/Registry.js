class Registry {
  constructor () {
    this.models = {}
  }

  add (name, model) {
    this.models[name] = model
  }

  get (name) {
    if (!this.models[name]) {
      console.log('error getting unknown Model:', name)
    }
    return this.models[name]
  }
}

export default new Registry()
