import { moduleForModel, test } from 'ember-qunit';

moduleForModel('event', 'Unit | Model | event', {
  // Specify the other units that are required for this test.
  needs: ['model:category', 'model:contact-info', 'model:orga', 'model:annotation', 'model:location']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
