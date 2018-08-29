import AnnotationCategory from '@/models/AnnotationCategory'
import Chapter from '@/models/Chapter'
import Event from '@/models/Event'
import Facet from '@/models/Facet'
import Location from '@/models/Location'
import MetaData from '@/models/MetaData'
import Navigation from '@/models/Navigation'
import Offer from '@/models/Offer'
import Orga from '@/models/Orga'
import User from '@/models/User'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class MixedType extends Model {
}

class App extends Model {
  static type = 'app'

  static relations () {
    return {
      orgas: {
        type: Relation.HAS_MANY,
        Model: Orga
      },

      events: {
        type: Relation.HAS_MANY,
        Model: Event,
        reverseRelations: event => {
          const relations = []
          // todos
          if (event.annotations.length) {
            relations.push(this.$rels.todos)
          }
          // orga.events
          event.hosts.forEach(host => {
            if (event.isUpcoming) {
              relations.push(host.$rels.upcoming_events)
            } else {
              relations.push(host.$rels.past_events)
            }
          })
          return relations
        }
      },

      todos: {
        type: Relation.HAS_MANY,
        Model: MixedType
      },

      search: {
        type: Relation.HAS_MANY,
        Model: MixedType
      },

      offers: {
        type: Relation.HAS_MANY,
        Model: Offer
      },

      locations: {
        type: Relation.HAS_MANY,
        Model: Location
      },

      navigation: {
        type: Relation.HAS_ONE,
        Model: Navigation
      },

      facets: {
        type: Relation.HAS_MANY,
        Model: Facet
      },

      chapters: {
        type: Relation.HAS_MANY,
        Model: Chapter
      },

      annotation_categories: {
        type: Relation.HAS_MANY,
        Model: AnnotationCategory
      },

      meta_data: {
        type: Relation.HAS_ONE,
        Model: MetaData
      },

      users: {
        type: Relation.HAS_MANY,
        Model: User
      }
    }
  }
}

export default Registry.add(App)
