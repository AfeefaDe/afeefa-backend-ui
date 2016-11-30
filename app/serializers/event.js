import DS from 'ember-data';
import SaveRelationshipsMixin from 'ember-data-save-relationships';

export default DS.JSONAPISerializer.extend(SaveRelationshipsMixin, {
  attrs: {
    contactInfos: { serialize: true },
    annotations:  { serialize: true },
    locations: { serialize: true }
  }
});
