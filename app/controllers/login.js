import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate: function () {
        let email = this.get('email');
        let password = this.get('password');
        this.get('session').authenticate('authenticator:devise', email, password).catch((reason) => {
          const alertData = {title: "Fehler beim Anmelden", description: 'Unbekannter Fehler', isError: true};
	        if(reason && reason.errors[0]) alertData.description = reason.errors[0];
          this.EventBus.publish('showAlert', alertData);
	      });
    }
  }
});
