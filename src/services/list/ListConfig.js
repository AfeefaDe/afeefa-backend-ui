export default class ListConfig {
  constructor (routeConfig) {
    this.routeConfig = routeConfig

    this.items = []
    this.isLoading = false
    this.params = {}
  }

  load () {
    this.items = []
    this.isLoading = true

    this.routeConfig.Model.Query.getAll(this.params).then(items => {
      this.items = items
      this.isLoading = false
    })
  }

  // facet filters
  // page
  // keyword
}
