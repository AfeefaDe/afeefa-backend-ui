import Ember from 'ember';

export default Ember.Controller.extend({
  dialogService: Ember.inject.service('global-dialog'),
});
