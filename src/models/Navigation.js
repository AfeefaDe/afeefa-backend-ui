import NavigationResource from '@/resources/Navigation'
import NavigationNavigationItemsResource from '@/resources/relations/NavigationNavigationItems'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'
import PlainJson from 'uidata/model/PlainJson'

import NavigationItem from './NavigationItem'

class Navigation extends Model {
  static type = 'fe_navigations'

  static Resource = NavigationResource

  static relations () {
    return {
      navigation_items: {
        type: Relation.HAS_MANY,
        Model: NavigationItem,
        Resource: NavigationNavigationItemsResource
      },

      owner_types: {
        type: Relation.HAS_MANY,
        Model: PlainJson
      }
    }
  }
}

export default Registry.add(Navigation)
