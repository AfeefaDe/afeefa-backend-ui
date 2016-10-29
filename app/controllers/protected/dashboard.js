import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  actions: {
    test: function() {
       let contact = this.get('store').createRecord('contactInfo');
       contact.set('mail', 'friedrich@weise.io');
       contact.save();
    }
  }
});
