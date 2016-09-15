import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate: function () {
        console.log(this.get('email'), this.get('password'));
        this.get('session').authenticate('authenticator:devise', this.get('email'), this.get('password'))
        .catch((reason) => {
      	console.log(reason);
        this.set('errorMessage', reason.errors[0]);});
    }
  }
});
