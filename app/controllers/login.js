import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate: function () {
        let email = this.get('email');
        let password = this.get('password');
        this.get('session').authenticate('authenticator:devise', email, password).catch((reason) => {
	        this.set('errorMessage', reason.errors[0]);
	        if(reason.errors[0]) {
            Materialize.toast(reason.errors[0], 10000);
          }
	      });
    }
  }
});
