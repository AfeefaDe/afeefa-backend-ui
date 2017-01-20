import { eq } from 'afeefa-backend-ui/helpers/eq';
import { module, test } from 'qunit';

module('Unit | Helper | eq');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = eq([42, 42]);
  assert.ok(result);

  result = eq([42, 43]);
  assert.notOk(result);

  result = eq([42, '42']);
  assert.notOk(result);
});
