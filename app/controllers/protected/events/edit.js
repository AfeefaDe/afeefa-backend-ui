import Ember from 'ember';
import CancelEditMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-controller';

export default Ember.Controller.extend(CancelEditMixin, {
  titleCached: Ember.computed('model', function() {
    return this.get('model.entryInstance.title');
  })
});
