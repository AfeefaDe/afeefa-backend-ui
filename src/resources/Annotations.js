import Annotation from '@/models/Annotation'
import { BASE } from '@/store/api'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

import Query from './base/Query'

class AnnotationsResource extends Resource {
  init (owner) {
    this.url = `${owner.type}/${owner.id}/annotations`
    this.http = Vue.resource(BASE + this.url)

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
