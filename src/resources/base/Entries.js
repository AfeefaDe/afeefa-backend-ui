import Categories from '../Categories'
import Annotations from '../Annotations'
import ResourceItems from '../ResourceItems'
import Orgas from '../Orgas'
import ActorRelations from '../ActorRelations'
import Contacts from '../Contacts'
import Orga from '@/models/Orga'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import LoadingState from '@/store/api/LoadingState'

export default {
  fetchParentOrga (entry, strategy = LoadingStrategy.LOAD_IF_NOT_CACHED) {
    const id = entry.relation('parentOrga').id
    if (!id) {
      return
    }

    if (entry.fetching('parentOrga')) {
      const wantToFetchMore = strategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED &&
        entry.fetching('parentOrga') !== strategy
      if (!wantToFetchMore) {
        return
      }
    }

    if (entry.fetched('parentOrga')) {
      const wantToFetchMore = strategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED &&
        entry.parent_orga._loadingState < LoadingState.FULLY_LOADED
      if (!wantToFetchMore) {
        return
      }
    }

    entry.fetching('parentOrga', strategy)
    Orgas.get(id, ['fetchParentOrga'], strategy, {
      'fetchParentOrga': LoadingStrategy.LOAD_IF_NOT_CACHED // fetch parent of parent :-)
    }).then(orga => {
      console.log('         fetchted! entry:', entry.id, 'parent:', orga.id, 'state:', orga._loadingState, 'strategy:', strategy)
      entry.parent_orga = orga
      entry.fetched('parentOrga', true)
    })
  },

  fetchCategory (entry) {
    if (entry.fetched('category')) {
      return
    }
    const id = entry._relationIds.category
    if (id) {
      Categories.get(id).then(category => {
        entry.category = category
        entry.fetched('category', true)
      })
    }
  },

  fetchSubCategory (entry) {
    if (entry.fetched('sub_category')) {
      return
    }
    const id = entry._relationIds.sub_category
    if (id) {
      Categories.get(id).then(category => {
        entry.sub_category = category
        entry.fetched('sub_category', true)
      })
    }
  },

  fetchAnnotations (entry, clone) {
    if (entry.fetched('annotations')) {
      return
    }
    Annotations.getAllForOwner(entry).then(annotations => {
      annotations.forEach(annotation => {
        annotation = clone ? Annotations.clone(annotation) : annotation
        entry.annotations.push(annotation)
      })
      entry.fetched('annotations', true)
    })
  },

  fetchContacts (entry, clone) {
    if (entry.fetched('contacts')) {
      return
    }
    Contacts.getAllForOwner(entry).then(contacts => {
      contacts.forEach(contact => {
        contact = clone ? Contacts.clone(contact) : contact
        entry.contacts.push(contact)
      })
      entry.fetched('contacts', true)
    })
  },

  fetchActorRelations (orga) {
    // do not fetch contacts multiple times
    if (orga.fetched('actorRelations')) {
      return
    }
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      ActorRelations.getRelatedActors(orga, actorRelation).then(actors => {
        orga[actorRelation] = actors
        orga.fetched('actorRelations', true)
      })
    })
  },

  fetchResources (orga) {
    // do not fetch contacts multiple times
    if (orga.fetched('resources')) {
      return
    }
    for (let id of orga._relationIds.resource_items) {
      ResourceItems.get(id).then(resourceItem => {
        orga.resource_items.push(resourceItem)
        orga.fetched('resources', true)
      })
    }
  },

  clone (entry) {
    const clone = entry.clone()
    this.fetchParentOrga(clone)
    this.fetchCategory(clone)
    this.fetchSubCategory(clone)
    this.fetchAnnotations(clone, true) // true => annotation.clone()
    this.fetchContacts(clone, true) // true => contact.clone()
    return clone
  },

  updateAttributes (entry, attributes) {
    if (attributes) {
      if ('active' in attributes) {
        entry.active = attributes.active === true
        entry.state_changed_at = new Date(attributes.state_changed_at)
      }
      entry.updated_at = new Date(attributes.updated_at)
    }
  }
}
