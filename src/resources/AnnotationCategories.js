import ModelResource from 'uidata/resource/ModelResource'

export default class AnnotationCategoriesResource extends ModelResource {
  url = 'annotation_categories{/id}'

  get (id) {
    return super.getAll().then(() => {
      return super.get(id)
    })
  }
}
