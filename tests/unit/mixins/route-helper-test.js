import Ember from 'ember';
import RouteHelperMixin from 'afeefa-backend-ui/mixins/route-helper';
import { module, test } from 'qunit';

module('Unit | Mixin | route helper');

// Replace this with your real tests.
test('it works', function(assert) {
  let RouteHelperObject = Ember.Object.extend(RouteHelperMixin);
  let subject = RouteHelperObject.create();
  assert.ok(subject);
});
