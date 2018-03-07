import Resource from 'uidata/resource/Resource'

export default class AnnotationCategoriesResource extends Resource {
  url = 'annotation_categories{/id}'

  get (id) {
    return super.getAll().then(() => {
      return super.get(id)
    })
  }
}
