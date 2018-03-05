import AnnotationCategory from '@/models/AnnotationCategory'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class AnnotationCategoriesResource extends Resource {
  init () {
    this.url = 'annotation_categories{/id}'
    this.Model = AnnotationCategory
  }
}

class AnnotationCategories extends Query {
  getApi () {
    return ['getAll', 'get']
  }

  getResource () {
    return new AnnotationCategoriesResource()
  }

  get (id) {
    return this.getAll().then(() => {
      return super.get(id)
    })
  }
}

export default new AnnotationCategories()
