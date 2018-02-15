import Vue from 'vue'
import { BASE } from '@/store/api'
import Annotation from '@/models/Annotation'
import Resource from './base/Resource'
import Query from './base/Query'

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

class Annotations extends Query {
  getApi () {
    return ['forOwner', 'getAll']
  }

  createResource ({owner}) {
    return new AnnotationsResource(owner)
  }
}

export default new Annotations()
