import AnnotationCategory from '@/models/AnnotationCategory'
import Resource from 'uidata/resource/Resource'

export default class AnnotationCategoriesResource extends Resource {
  url = 'annotation_categories{/id}'
  Model = AnnotationCategory

  get (id) {
    return super.getAll().then(() => {
      return super.get(id)
    })
  }
}
