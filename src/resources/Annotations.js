import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Annotation from '@/models/Annotation'
import Resource from './base/Resource'

class AnnotationsResource extends Resource {
  init ([owner]) {
    this.url = BASE + `${owner.type}/${owner.id}/annotations`
    this.http = Vue.resource(this.url)
    this.listType = 'annotations'
    this.listParams = JSON.stringify(owner.relation('annotations').listParams(owner))
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
