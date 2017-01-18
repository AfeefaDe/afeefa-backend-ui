import Ember from 'ember';
import RSVP from 'rsvp';
import RouteHelper from '../../mixins/route-helper';
import CancelEditEntryMixin from './cancel-edit-entry-mixin';

export default Ember.Route.extend(RouteHelper, CancelEditEntryMixin, {
  model() {
    return RSVP.hash({
      orgas: this.modelFor('protected').orgas,
      entryInstance: this.store.createRecord('event'),
      contactInfoInstance: this.store.createRecord('contactInfo'),
      locationInstance: this.store.createRecord('location'),
    });
  }
});
