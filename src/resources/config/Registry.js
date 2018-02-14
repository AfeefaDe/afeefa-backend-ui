class ResourceRegistry {
  constructor () {
    this.resources = {}
  }

  add (name, resource) {
    this.resources[name] = resource
  }

  get (name) {
    if (!this.resources[name]) {
      console.error('error getting unknown Resource:', name)
    }
    return this.resources[name]
  }
}

export default new ResourceRegistry()
