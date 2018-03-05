import ResourceItem from '@/models/ResourceItem'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class ResourceItemsResource extends Resource {
  init (relation) {
    this.url = `orgas/${relation.owner.id}/resource_items{/id}`
    this.Model = ResourceItem
  }
}

class ResourceItems extends Query {
  getApi () {
    return ['forRelation', 'getAll']
  }

  createResource (relation) {
    return new ResourceItemsResource(relation)
  }
}

export default new ResourceItems()
