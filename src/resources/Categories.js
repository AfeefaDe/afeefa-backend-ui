import Category from '@/models/Category'
import Query from 'uidata/resource/Query'
import Resource from 'uidata/resource/Resource'

class CategoriesResource extends Resource {
  init () {
    this.url = 'categories{/id}'
    this.Model = Category
  }
}

class Categories extends Query {
  getResource () {
    return new CategoriesResource()
  }
}

export default new Categories()
