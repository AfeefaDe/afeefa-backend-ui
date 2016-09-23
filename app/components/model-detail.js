import Ember from 'ember';

export default Ember.Component.extend({
  attr: Ember.computed('model', function() {
    var model = this.get('model');
    var attributes = Object.keys(model.toJSON())
    return attributes;
  })
});
