import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate: function () {
        let email = this.get('email');
        let password = this.get('password');
        this.get('session').authenticate('authenticator:devise', email, password).catch((reason) => {
	        if(reason && reason.errors[0]) {
            this.set('errorMessage', reason.errors[0]);
            Materialize.toast(reason.errors[0], 10000);
          }
          else Materialize.toast("Login Error undefined", 1000);
	      });
    }
  }
});
