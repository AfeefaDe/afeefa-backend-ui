import Annotation from '@/models/Annotation'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

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
