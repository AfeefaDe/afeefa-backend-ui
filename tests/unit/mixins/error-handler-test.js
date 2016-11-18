import Ember from 'ember';
import HandleInputErrorMixin from 'afeefa-backend-ui/mixins/handle-input-error';
import { module, test } from 'qunit';

module('Unit | Mixin | handle input error');

// Replace this with your real tests.
test('it works', function(assert) {
  let HandleInputErrorObject = Ember.Object.extend(HandleInputErrorMixin);
  let subject = HandleInputErrorObject.create();
  assert.ok(subject);
});
