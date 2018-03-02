import Annotation from '@/models/Annotation'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class AnnotationsResource extends Resource {
  init (relation) {
    this.url = `${relation.owner.type}/${relation.owner.id}/annotations`
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
