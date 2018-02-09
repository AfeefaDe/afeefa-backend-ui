import Categories from '../Categories'
import Annotations from '../Annotations'
import ResourceItems from '../ResourceItems'
import Orgas from '../Orgas'
import ActorRelations from '../ActorRelations'
import Contacts from '../Contacts'
import Orga from '@/models/Orga'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import ResourceItem from '@/models/ResourceItem'

export default {
  fetchParentOrga (entry, strategy = LoadingStrategy.LOAD_IF_NOT_CACHED) {
    entry.relation('parentOrga').fetch(id => {
      return Orgas.get(id, ['fetchParentOrga'], strategy, { // fetch parent orga with only its own parent orga relation
        'fetchParentOrga': LoadingStrategy.LOAD_IF_NOT_CACHED // do not force fully loading of parents parent orga
      }).then(orga => {
        entry.parent_orga = orga
        return orga
      })
    }, strategy)
  },

  fetchCategory (entry) {
    entry.relation('category').fetch(id => {
      return Categories.get(id).then(category => {
        entry.category = category
        return category
      })
    })
  },

  fetchSubCategory (entry) {
    entry.relation('subCategory').fetch(id => {
      return Categories.get(id).then(category => {
        entry.sub_category = category
        return category
      })
    })
  },

  fetchAnnotations (entry, clone) {
    entry.relation('annotations').fetch(() => {
      return Annotations.getAllForOwner(entry).then(annotations => {
        entry.annotations.length = 0
        annotations.forEach(annotation => {
          annotation = clone ? Annotations.clone(annotation) : annotation
          entry.annotations.push(annotation)
        })
        return annotations
      })
    })
  },

  fetchContacts (entry, clone) {
    entry.relation('contacts').fetch(() => {
      return Contacts.getAllForOwner(entry).then(contacts => {
        entry.contacts.length = 0
        contacts.forEach(contact => {
          contact = clone ? Contacts.clone(contact) : contact
          entry.contacts.push(contact)
        })
        return contacts
      })
    })
  },

  fetchActorRelations (orga) {
    orga.relation('actorRelations').fetch(id => {
      return ActorRelations.getForOrga(orga).then(actorRelations => {
        orga.actorRelations = actorRelations
        Orga.ACTOR_RELATIONS.forEach(actorRelation => {
          orga[actorRelation] = actorRelations[actorRelation]
        })
        return actorRelations
      })
    })
  },

  fetchResources (orga, clone) {
    orga.relation('resourceItems').fetch(() => {
      return ResourceItems.getAllForOrga(orga).then(resourceItems => {
        orga.resource_items.length = 0
        resourceItems.forEach(resourceItem => {
          resourceItem = clone ? ResourceItem.clone(resourceItem) : resourceItem
          orga.resource_items.push(resourceItem)
        })
        return resourceItems
      })
    })
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
