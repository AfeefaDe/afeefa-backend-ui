import Ember from 'ember';
import DS from 'ember-data';
import SaveRelationshipsMixin from 'afeefa-backend-ui/mixins/save-relationships';

export default DS.JSONAPISerializer.extend(SaveRelationshipsMixin, {
  attrs: {
    contactInfos: { serialize: true },
    annotations:  { serialize: true },
    locations: { serialize: true }
  },
  payloadKeyFromModelName(modelName) {
    //return plural model name: 'orga', 'event'
    let underscore = Ember.String.underscore(modelName);
    return Ember.String.pluralize(underscore);
  },
  keyForRelationship: function(key) {
    //return underscore keys for relationships
    return Ember.String.underscore(key);
  },
  keyForAttribute: function(key) {
    //return underscore keys for attributes
    return Ember.String.underscore(key);
  },
  keyForLink: function(key) {
    //return underscore keys for links
    return Ember.String.underscore(key);
  },
  normalizeSaveResponse(store, modelName, obj) {
    return this._super(store, modelName, obj);
  }
});
