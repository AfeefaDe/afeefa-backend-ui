import Categories from '../Categories'
import AnnotationCategories from '../AnnotationCategories'
import Annotations from '../Annotations'
import ResourceItems from '../ResourceItems'
import Orgas from '../Orgas'
import ActorRelations from '../ActorRelations'
import Contacts from '../Contacts'
import LoadingState from '@/store/api/LoadingState'
import Orga from '@/models/Orga'
import LoadingStrategy from '@/store/api/LoadingStrategy'

export default {
  fetchParentOrga (entry, strategy = LoadingStrategy.RETURN_CACHED_IF_FULLY_LOADED_OR_LOAD) {
    // do not fetch parent_orga multiple times
    if (entry._relationLoadingStarted('parent_orga')) {
      return
    }
    if (entry.parent_orga && entry.parent_orga._loadingState === LoadingState.FULLY_LOADED) {
      return
    }
    const id = entry._relationIds.parent_orga
    if (id) {
      // do not load parent orga from remote by default
      Orgas.get(id, [], strategy).then(orga => {
        entry.parent_orga = orga
      })
    }
    entry._startLoadingRelation('parent_orga')
  },

  fetchCategory (entry) {
    // do not fetch category multiple times
    if (entry._relationLoadingStarted('category')) {
      return
    }
    const id = entry._relationIds.category
    if (id) {
      Categories.get(id).then(category => {
        entry.category = category
      })
    }
    entry._startLoadingRelation('category')
  },

  fetchSubCategory (entry) {
    // do not fetch sub_category multiple times
    if (entry._relationLoadingStarted('sub_category')) {
      return
    }
    const id = entry._relationIds.sub_category
    if (id) {
      Categories.get(id).then(category => {
        entry.sub_category = category
      })
    }
    entry._startLoadingRelation('sub_category')
  },

  fetchAnnotations (entry, clone) {
    // do not fetch annotations multiple times
    if (entry._relationLoadingStarted('annotations')) {
      return
    }
    for (let id of entry._relationIds.annotations) {
      Annotations.get(id).then(annotation => {
        if (annotation) {
          annotation = clone ? annotation.clone() : annotation
          AnnotationCategories.get(annotation._relationIds.annotationCategory).then(annotationCategory => {
            annotation.annotationCategory = annotationCategory
            entry.annotations.push(annotation)
          })
        }
      })
    }
    entry._startLoadingRelation('annotations')
  },

  fetchContacts (entry, clone) {
    // do not fetch contacts multiple times
    if (entry._relationLoadingStarted('contacts')) {
      return
    }
    Contacts.getAllForOwner(entry).then(contacts => {
      contacts.forEach(contact => {
        contact = clone ? Contacts.clone(contact) : contact
        entry.contacts.push(contact)
      })
    })
    entry._startLoadingRelation('contacts')
  },

  fetchActorRelations (orga) {
    // do not fetch contacts multiple times
    if (orga._relationLoadingStarted('actorRelations')) {
      return
    }
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      ActorRelations.getRelatedActors(orga, actorRelation).then(actors => {
        orga[actorRelation] = actors
      })
    })
    orga._startLoadingRelation('actorRelations')
  },

  fetchResources (orga) {
    // do not fetch contacts multiple times
    if (orga._relationLoadingStarted('resources')) {
      return
    }
    for (let id of orga._relationIds.resource_items) {
      ResourceItems.get(id).then(resourceItem => {
        orga.resource_items.push(resourceItem)
      })
    }
    orga._startLoadingRelation('resources')
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
