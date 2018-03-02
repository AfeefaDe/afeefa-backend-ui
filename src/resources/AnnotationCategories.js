import AnnotationCategory from '@/models/AnnotationCategory'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class AnnotationCategoriesResource extends Resource {
  init () {
    this.url = 'annotation_categories{/id}'
  }

  getItemModel () {
    return AnnotationCategory
  }
}

class AnnotationCategories extends Query {
  getApi () {
    return ['getAll', 'get']
  }

  createResource () {
    return new AnnotationCategoriesResource()
  }

  get (id) {
    return this.getAll().then(() => {
      return super.get(id)
    })
  }
}

export default new AnnotationCategories()
