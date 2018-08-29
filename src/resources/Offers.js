// import Orga from '@/models/Orga'
import Resource from 'uidata/resource/Resource'

export default class OffersResource extends Resource {
  url = 'offers{/id}{?ids}'

  lazyLoadList = true
}
