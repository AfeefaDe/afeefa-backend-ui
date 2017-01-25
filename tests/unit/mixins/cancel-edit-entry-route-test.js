import Ember from 'ember';
import CancelEditEntryRouteMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-route';
import { module, test } from 'qunit';

module('Unit | Mixin | cancel edit entry route');

// Replace this with your real tests.
test('it works', function(assert) {
  let CancelEditEntryRouteObject = Ember.Object.extend(CancelEditEntryRouteMixin);
  let subject = CancelEditEntryRouteObject.create();
  assert.ok(subject);
});
