import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize (snapshot) {
    let json = this._super(...arguments),
        changedAttributes = snapshot.changedAttributes(),
        attributes = {};

    Object.keys(changedAttributes).forEach(key => {
        attributes[this.keyForAttribute(key)] = changedAttributes[key][1];
    });

    json["data"]["attributes"] = attributes;
    //example: remove relationship from json:
    //delete json["data"]["relationships"];
    console.log("[custom orga serializer] serialized JSON: ", json);
    return json;
  },
  normalize(params) {
    let json = this._super(...arguments);
    console.log("Normalized", json);
    return json;
  },
  payloadKeyFromModelName(modelName) {
    //return singular model name: 'orga'
    return modelName;
  },
  keyForRelationship: function(key, relationship, method) {
    //return camelized keys for relationships
    return Ember.String.camelize(key);
  },
  keyForAttribute: function(key, relationship, method) {
    //return camelized keys for attributes
    return Ember.String.camelize(key);
  },
  keyForLink: function(key, relationship, method) {
    //return camelized keys for links
    return Ember.String.camelize(key);
  }
});
