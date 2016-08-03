import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  user: {
  	firstName: 'Rudi',
  	lastName: 'Dutschke'
  }
});
