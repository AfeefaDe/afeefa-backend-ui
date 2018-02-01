import Categories from '@/resources/Categories'
import AnnotationCategories from '@/resources/AnnotationCategories'
import Annotations from '@/resources/Annotations'
import ResourceItems from '@/resources/ResourceItems'
import Orgas from '@/resources/Orgas'

export default {
  fetchParentOrga (entry) {
    if (!entry.parent_orga || !entry.parent_orga._fullyLoaded) {
      const id = entry._relationIds.parent_orga
      if (id) {
        Orgas.get(id, [
          'fetchCategory',
          'fetchSubCategory'
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

  clone (entry) {
    const clone = entry.clone()
    this.fetchCategory(clone)
    this.fetchSubCategory(clone)
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
