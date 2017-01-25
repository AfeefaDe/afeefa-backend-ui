import Ember from 'ember';

export default Ember.Component.extend({
  dialogService: Ember.inject.service('dialog'),

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

  visibilityChanges: Ember.observer('dialogService.show', function() {
    if (this.get('dialogService.show')) {
      this.$('.dialog').attr('tabindex',0);
      this.$('.dialog').focus();
    } else {
      this.$('.dialog').blur();
    }
  }),

  keyDown: function (event) {
    if (event.keyCode === 27) {
      this.get('dialogService').hideDialog('cancel');
    }
  }
});
