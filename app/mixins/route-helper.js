import Ember from 'ember';

export default Ember.Mixin.create({
    historyService: Ember.inject.service('route-history'),

    actions: {
      goBack: function() {
        this.get('historyService').goBack();
      }
    }
});
