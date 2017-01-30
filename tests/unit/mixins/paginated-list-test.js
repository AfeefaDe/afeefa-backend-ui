import Ember from 'ember';
import PaginatedListMixin from 'afeefa-backend-ui/mixins/paginated-list';
import { module, test } from 'qunit';

module('Unit | Mixin | paginated list');

// Replace this with your real tests.
test('it works', function(assert) {
  let PaginatedListObject = Ember.Object.extend(PaginatedListMixin);
  let subject = PaginatedListObject.create();
  assert.ok(subject);
});
