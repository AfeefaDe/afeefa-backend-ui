import ModelResource from 'uidata/resource/ModelResource'

export default class CategoriesResource extends ModelResource {
  url = 'categories{/id}'

  get (id) {
    return super.getAll().then(() => {
      return super.get(id)
    })
  }
}
