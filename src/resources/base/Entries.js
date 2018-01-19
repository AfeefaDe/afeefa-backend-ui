import Categories from '@/resources/Categories'
import AnnotationCategories from '@/resources/AnnotationCategories'
import Annotations from '@/resources/Annotations'
import ResourceItems from '@/resources/ResourceItems'
import Contacts from '@/resources/Contacts'
import Locations from '@/resources/Locations'
import Orgas from '@/resources/Orgas'

import Contact from '@/models/Contact'
import Location from '@/models/Location'

export default {
  fetchParentOrga (entry) {
    if (!entry.parent_orga) {
      const id = entry._relationIds.parent_orga
      if (id) {
        Orgas.get(id, [
          'fetchCategory',
          'fetchSubCategory',
          'fetchContact'
        ]).then(orga => {
          entry.parent_orga = orga
        })
      }
    }
  },

  fetchCategory (entry) {
    if (!entry.category) {
      const id = entry._relationIds.category
      if (id) {
        Categories.get(id).then(category => {
          entry.category = category
        })
      }
    }
  },

  fetchSubCategory (entry) {
    if (!entry.sub_category) {
      const id = entry._relationIds.sub_category
      if (id) {
        Categories.get(id).then(category => {
          entry.sub_category = category
        })
      }
    }
  },

  fetchLocation (entry, clone) {
    if (!entry.location) {
      const id = entry._relationIds.location
      if (id) {
        Locations.get(id).then(location => {
          entry.location = clone ? location.clone() : location
        })
      } else {
        entry.location = new Location()
      }
    }
  },

  fetchContact (entry, clone) {
    if (!entry.contact) {
      const id = entry._relationIds.contact
      if (id) {
        Contacts.get(id).then(contact => {
          entry.contact = clone ? contact.clone() : contact
        })
      } else {
        entry.contact = new Contact()
      }
    }
  },

  fetchAnnotations (entry, clone) {
    // do not fetch annotations multiple times
    if (entry.annotations.__isLoading) {
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
    entry.annotations.__isLoading = true
  },

  fetchResources (orga) {
    if (orga.resource_items.__isLoading) {
      return
    }
    for (let id of orga._relationIds.resource_items) {
      ResourceItems.get(id).then(resourceItem => {
        orga.resource_items.push(resourceItem)
      })
    }

    orga.resource_items.__isLoading = true
  },

  create (entry) {
    entry.location = new Location()
    entry.contact = new Contact()
    return entry
  },

  clone (entry) {
    const clone = entry.clone()
    this.fetchParentOrga(clone)
    this.fetchCategory(clone)
    this.fetchSubCategory(clone)
    this.fetchLocation(clone, true) // true => location.clone()
    this.fetchContact(clone, true) // true => contact.clone()
    this.fetchAnnotations(clone, true) // true => annotation.clone()
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
