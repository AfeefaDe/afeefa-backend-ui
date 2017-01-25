import Ember from 'ember';
import CancelEditEntryControllerMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | cancel edit entry controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let CancelEditEntryControllerObject = Ember.Object.extend(CancelEditEntryControllerMixin);
  let subject = CancelEditEntryControllerObject.create();
  assert.ok(subject);
});
