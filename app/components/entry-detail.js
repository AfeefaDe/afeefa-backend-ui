import Ember from 'ember';

export default Ember.Component.extend({
  attr: Ember.computed('model', function() {
    let model = this.get('model');
    var attributes = [];
    model.eachAttribute(function(name, meta) {
      let entry = {name: name, type: meta.type};
      attributes.push(entry);
    });
    return attributes;
  })
});
