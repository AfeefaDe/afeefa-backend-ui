import Ember from 'ember';

// create an application session,
// provide actions for authenticating and invalidating the session
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

//export default Ember.Route.extend(ApplicationRouteMixin);

export default Ember.Controller.extend(ApplicationRouteMixin,{
  session: Ember.inject.service('session'),
  user: {
  	firstName: 'Rudi',
  	lastName: 'Dutschke'
  }
});
