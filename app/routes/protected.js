import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin,{
  model() {
    console.log("Load protected model");
    return this.store.findRecord('user', this.get('session.currentUser'));
  }
});
