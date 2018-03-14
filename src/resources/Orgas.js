import ActorRelations from '@/models/ActorRelations'

import EntriesResource from './base/Entries'

export default class OrgasResource extends EntriesResource {
  url = 'orgas{/id}'

  itemDeleted (orga) {
    super.itemDeleted(orga)

    orga.getParentRelations().forEach(relation => {
      if (relation.owner instanceof ActorRelations) {
        const actorRelations = relation.owner
        actorRelations.getParentRelations().forEach(relation => {
          relation.reloadOnNextGet()
        })
      }
    })
  }
}
