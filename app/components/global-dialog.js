import Ember from 'ember';

export default Ember.Component.extend({
  dialogService: Ember.inject.service('global-dialog'),

  actions: {
    yes: function() {
      this.get('dialogService').hideDialog('yes');
    },
    no: function() {
      this.get('dialogService').hideDialog('no');
    },
    cancel: function() {
      this.get('dialogService').hideDialog('cancel');
    }
  },
});
