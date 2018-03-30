export default class RouteConfig {
  constructor (routeComponent, itemId) {
    this.$t = routeComponent.$t

    this.itemId = itemId || null

    this.Model = null
    this.routeName = null
    this.messages = {}
  }
}
