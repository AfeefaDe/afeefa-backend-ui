import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:application', 'Unit | Controller | application', {
  // Specify the other units that are required for this test.
  needs: ['service:dialog']
});

test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('dialog service injected', function(assert) {
  const controller = this.subject();
  const dialogService = controller.get('dialogService');
  assert.ok(dialogService);
});
