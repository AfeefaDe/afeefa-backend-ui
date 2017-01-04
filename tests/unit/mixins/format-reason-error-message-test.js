import Ember from 'ember';
import FormReasonErrorMessageMixin from 'afeefa-backend-ui/mixins/form-reason-error-message';
import { module, test } from 'qunit';

module('Unit | Mixin | form reason error message');

// Replace this with your real tests.
test('it works', function(assert) {
  let FormReasonErrorMessageObject = Ember.Object.extend(FormReasonErrorMessageMixin);
  let subject = FormReasonErrorMessageObject.create();
  assert.ok(subject);
});
