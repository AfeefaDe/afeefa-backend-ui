import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate: function () {
        this.get('session').authenticate('authenticator:devise', this.get('email'), this.get('password'))
        .catch((reason) => {
	        this.set('errorMessage', reason.errors[0]);
	        if(reason.errors[0]) Materialize.toast(reason.errors[0], 10000)
	      });
    }
  }
});
