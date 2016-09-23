import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalize(modelClass, resourceHash) {
    let json = this._super(...arguments);
    console.log("Normalize "+modelClass.modelName+" with data:", json);
    return json;
  }
});
