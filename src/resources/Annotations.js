import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Annotation from '@/models/Annotation'
import Resource from './base/Resource'

class AnnotationsResource extends Resource {
  init ([owner]) {
    this.url = BASE + `${owner.type}/${owner.id}/annotations`
    this.http = Vue.resource(this.url)
    this.listCacheKey = 'annotations'
    this.listCacheParams = JSON.stringify(owner.relation('annotations').cacheParams(owner))
  }

  createItem () {
    return new Annotation()
  }
}

export default {
  getAllForOwner (owner) {
    const resource = new AnnotationsResource(owner)
    return store.dispatch('api/getList', {resource})
  }
}
