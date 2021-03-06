import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

import Navigation from './Navigation'

class NavigationItem extends Model {
  static type = 'fe_navigation_items'

  static attributes () {
    return {
      title: DataTypes.String,

      color: DataTypes.String,

      icon: {
        type: DataTypes.String,
        value: value => value || null
      },

      order: DataTypes.Int
    }
  }

  static relations () {
    return {
      navigation: {
        type: Relation.HAS_ONE,
        Model: Navigation
      },

      sub_items: {
        type: Relation.HAS_MANY,
        Model: NavigationItem
      },

      parent: {
        type: Relation.HAS_ONE,
        Model: NavigationItem
      }
    }
  }

  static create (navigation, parent) {
    const menuItem = new NavigationItem()
    menuItem.navigation = navigation
    menuItem.$rels.navigation.id = navigation.id
    if (parent) {
      menuItem.parent = parent
      menuItem.$rels.parent.id = parent.id

      if (parent.sub_items.length) {
        const [lastItem] = parent.sub_items.slice(-1)
        menuItem.order = lastItem.order + 1
      }
    } else {
      if (navigation.navigation_items.length) {
        const [lastItem] = navigation.navigation_items.slice(-1)
        menuItem.order = lastItem.order + 1
      }
    }
    return menuItem
  }

  init () {
    this.previewColor = null
    this.selectedForMoval = false
  }

  get container () {
    return this.navigation
  }

  serialize () {
    const data = {
      title: this.title,
      color: this.color,
      icon: this.icon,
      order: this.order,
      parent_id: this.parent ? this.parent.id : null
    }

    return data
  }

  get info () {
    return super.info + ` title="${this.title}" subs="${this.sub_items.length}"`
  }
}

export default Registry.add(NavigationItem)
