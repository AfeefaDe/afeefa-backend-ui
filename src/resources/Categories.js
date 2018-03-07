import Resource from 'uidata/resource/Resource'

export default class CategoriesResource extends Resource {
  url = 'categories{/id}'

  get (id) {
    return super.getAll().then(() => {
      return super.get(id)
    })
  }
}
