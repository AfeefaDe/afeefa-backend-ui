import Ember from 'ember';

export default Ember.Route.extend({

  session: Ember.inject.service('session'),

    actions: {
      authenticate() {
        let { identification, password } = this.getProperties('identification', 'password');
        this.get('session').authenticate('authenticator:devise', identification, password).catch((reason) => {
          this.set('errorMessage', reason.error || reason);
        });
      }
    }

});
