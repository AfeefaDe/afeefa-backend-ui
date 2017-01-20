import { gt } from 'afeefa-backend-ui/helpers/gt';
import { module, test } from 'qunit';

module('Unit | Helper | gt');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = gt([42, 10]);
  assert.ok(result);

  result = gt([42, 42]);
  assert.notOk(result);
});
