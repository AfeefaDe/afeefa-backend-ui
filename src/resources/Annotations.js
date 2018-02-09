import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Annotation from '@/models/Annotation'
import Resource from './base/Resource'
import AnnotationCategories from './AnnotationCategories'

class AnnotationsResource extends Resource {
  init () {
    this.http = Vue.resource(BASE + 'annotations{/id}')
    this.listCacheKey = 'annotations'
  }

  createItem () {
    return new Annotation()
  }
}

export default {
  fetchCategory (annotation) {
    annotation.relation('annotationCategory').fetch(id => {
      return AnnotationCategories.get(id).then(annotationCategory => {
        annotation.annotationCategory = annotationCategory
        return annotationCategory
      })
    })
  },

  getAllForOwner (owner) {
    const resource = new AnnotationsResource(owner.id)
    resource.url = BASE + `${owner.type}/${owner.id}/annotations`
    resource.http = Vue.resource(resource.url)
    resource.listCacheParams = owner.relation('annotations').cacheParams

    return store.dispatch('api/getList', {resource}).then(annotations => {
      annotations.forEach(annotation => {
        this.fetchCategory(annotation)
      })
      return annotations
    })
  },

  get (id) {
    const resource = new AnnotationsResource()
    return store.dispatch('api/getItem', {resource, id}).then(annotation => {
      this.fetchCategory(annotation)
      return annotation
    })
  },

  /*
   * public method to create new annoation in editentry form
   */
  createItem () {
    const resource = new AnnotationsResource()
    return resource.createItem()
  },

  clone (annotation) {
    const clone = annotation.clone()
    this.fetchCategory(clone)
    return clone
  }
}
