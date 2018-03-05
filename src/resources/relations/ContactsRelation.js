import RelationQuery from 'data/resource/RelationQuery'

export default class ContactsRelation extends RelationQuery {
  getSaveOptions () {
    return {
      wrapInDataProperty: false
    }
  }
}
