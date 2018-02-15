import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Annotation from '@/models/Annotation'
import Resource from './base/Resource'

class AnnotationsResource extends Resource {
  init ([owner]) {
    this.url = `${owner.type}/${owner.id}/annotations`
    this.http = Vue.resource(BASE + this.url)

    this.listType = 'annotations'
    this.listParams = owner.relation('annotations').listParams()
  }

  getItemModel () {
    return Annotation
  }
}

export default {
  getAllForOwner (owner) {
    const resource = new AnnotationsResource(owner)
    return store.dispatch('api/getList', {resource})
  }
}
