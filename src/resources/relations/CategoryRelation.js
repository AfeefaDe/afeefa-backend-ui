import Category from '@/models/Category'
import RelationQuery from 'uidata/resource/RelationQuery'
import RelationResource from 'uidata/resource/RelationResource'

class CategoriesResource extends RelationResource {
  init () {
    this.url = 'categories{/id}'
  }
}

export default class CategoryRelation extends RelationQuery {
  getResource () {
    return new CategoriesResource(this.relation)
  }

  get (id) {
    return Category.Query.getAll().then(() => {
      return super.get(id)
    })
  }
}
