import Ember from 'ember';

export default Ember.Controller.extend({
  titleCached: Ember.computed('model', function() {
    return this.get('model.orga.title');
  })
});
