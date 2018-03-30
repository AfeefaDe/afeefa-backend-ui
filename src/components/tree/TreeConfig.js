import RouteConfig from '@/services/router/RouteConfig'

export default class Config extends RouteConfig {
  constructor (routeComponent, containerId) {
    super(routeComponent, containerId)

    this.containerName = null
    this.relationName = null
    this.canColorizeItems = false
  }

  getContainer (treeItem) {
    return treeItem[this.containerName]
  }

  getTreeItems (container) {
    return container[this.relationName]
  }

  getTreeItemsRelation (container) {
    return container.$rels[this.relationName]
  }

  loadTreeItems (container) {
    // override
  }

  createNewTreeItem (container, parent) {
    // override
  }

  associateItemLink (treeItem) {
    // override
  }
}
