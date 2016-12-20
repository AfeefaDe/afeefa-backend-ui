import DS from 'ember-data';
import SaveRelationshipsMixin from 'ember-data-save-relationships';

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
    console.log(store, modelName, obj);
    const rels = obj.data.relationships || [];

    Object.keys(rels).forEach(rel => {

      // guard against potential `null` relationship, allowed by JSON API
      if (!rels[rel]) {
        return;
      }

      let relationshipData = rels[rel].data;
      if (Array.isArray(relationshipData)) {
        // hasMany
        relationshipData = relationshipData.map(json => {
          console.log("Mapping hasMany rel: ", json);
          json.type = Ember.String.singularize(json.type);
          this.updateRecord(json, store);
        });
      } else {
        // belongsTo
        console.log("Mapping belinksto rel: ", relationshipData);
        relationshipData.type = Ember.String.singularize(relationshipData.type);
        relationshipData = this.updateRecord(relationshipData, store);
      }

    });

    return this._super(store, modelName, obj);

  }
  /*
  normalizeSaveResponse(store, modelName, obj) {
    //hack: remove relationships when normalizing response, cause they only contain links
    if(obj.data.relationships) obj.data.relationships = {};
    return this._super(store, modelName, obj);
  }*/
});
