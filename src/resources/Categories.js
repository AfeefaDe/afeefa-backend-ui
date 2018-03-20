import Resource from 'uidata/resource/Resource'

export default class CategoriesResource extends Resource {
  url = 'categories{/id}'

  listLoaded (categories, params) {
    if (params && params.area) {
      categories.forEach(category => {
        category.area = params.area
      })
    }
  }

  get (id) {
    return super.getAll().then(() => {
      return super.get(id)
    })
  }
}
