export default class RouteConfig {
  constructor (routeComponent, itemId) {
    this.$t = routeComponent.$t

    this.itemId = itemId || null

    this.routeName = null
    this.Resource = null
    this.messages = {}
  }
}
