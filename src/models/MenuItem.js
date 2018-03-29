import FacetItemOwnersResource from '@/resources/relations/FacetItemOwners'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class MenuItem extends Model {
  static type = 'navigation_items'

  static ResourceUrl = 'fe_navigation_items'

  static attributes () {
    return {
      title: DataTypes.String,

      color: DataTypes.String,

      count_owners: DataTypes.Int
    }
  }

  static relations () {
    return {
      sub_items: {
        type: Relation.HAS_MANY,
        Model: MenuItem
      },

      parent: {
        type: Relation.HAS_ONE,
        Model: MenuItem
      },

      owners: {
        type: Relation.HAS_MANY,
        Resource: FacetItemOwnersResource
      }
    }
  }

  static create (menu, parent) {
    const menuItem = new MenuItem()
    menuItem.menu = menu
    menuItem.$rels.menu.id = menu.id
    if (parent) {
      menuItem.parent = parent
      menuItem.$rels.parent.id = parent.id
    }
    return menuItem
  }

  constructor () {
    super()

    this.new_menu_id = null
    this.previewColor = null
  }

  serialize () {
    const data = {
      title: this.title,
      color: this.color,
      parent_id: this.parent ? this.parent.id : null
    }

    return data
  }

  get info () {
    return super.info + ` title="${this.title}" subs="${this.sub_items.length}"`
  }
}

export default Registry.add(MenuItem)
