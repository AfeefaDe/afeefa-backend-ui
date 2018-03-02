import Annotation from '@/models/Annotation'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class AnnotationsResource extends Resource {
  init (relation) {
    this.url = `${relation.owner.type}/${relation.owner.id}/annotations`
    this.http = Vue.resource(BASE + this.url)
  }

  getItemModel () {
    return Annotation
  }
}

class Annotations extends Query {
  getApi () {
    return ['forRelation', 'getAll']
  }

  createResource ({relation}) {
    return new AnnotationsResource(relation)
  }
}

export default new Annotations()
