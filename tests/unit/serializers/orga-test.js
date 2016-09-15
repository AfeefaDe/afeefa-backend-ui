import { moduleForModel, test } from 'ember-qunit';

moduleForModel('orga', 'Unit | Serializer | orga', {
  // Specify the other units that are required for this test.
  needs: ['serializer:orga']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
