import NavigationItemsResource from '@/resources/NavigationItems'
import NavigationItemFacetItemsResource from '@/resources/relations/NavigationItemFacetItems'
import NavigationItemOwnersResource from '@/resources/relations/NavigationItemOwners'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

import FacetItem from './FacetItem'
import Navigation from './Navigation'

class NavigationItem extends Model {
  static type = 'fe_navigation_items'

  static Resource = NavigationItemsResource

  static attributes () {
    return {
      title: DataTypes.String,

      color: DataTypes.String,

      icon: {
        type: DataTypes.String,
        value: value => value || null
      },

      count_owners: DataTypes.Int,

      count_owners_via_facet_items: DataTypes.Int,

      count_direct_owners: DataTypes.Int
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
      },

      facet_items: {
        type: Relation.HAS_MANY,
        Model: FacetItem,
        Resource: NavigationItemFacetItemsResource
      },

      owners: {
        type: Relation.HAS_MANY,
        Resource: NavigationItemOwnersResource
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
    }
    return menuItem
  }

  constructor () {
    super()

    // Todo: find a solution to mark item loaded in lists to be fully loaded
    this._loadingState = 1
    this.previewColor = null
  }

  get container () {
    return this.navigation
  }

  beforeDeserialize (json) {
    json.relationships = json.relationships || {}
    json.relationships.navigation = {
      id: 'app'
    }
    return json
  }

  serialize () {
    const data = {
      title: this.title,
      color: this.color,
      icon: this.icon,
      parent_id: this.parent ? this.parent.id : null
    }

    return data
  }

  get info () {
    return super.info + ` title="${this.title}" subs="${this.sub_items.length}"`
  }
}

export default Registry.add(NavigationItem)
