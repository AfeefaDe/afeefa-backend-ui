import Ember from 'ember';
import CancelEditEntryControllerMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-controller';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';

moduleFor('controller:application', 'Unit | Tests | test fixtures', {
  needs: [
    'model:event',
    'model:orga',
    'model:annotation',
    'model:contact-info',
    'model:category',
    'model:location',
    'model:entry'
  ],

  beforeEach () {
    const ctrl = this.subject();
    ctrl.set('store', Ember.getOwner(this).lookup('service:store'));
  }
});


test('existing event properties', function(assert) {
  Ember.run(() => {
    const ctrl = this.subject();
    const store = ctrl.get('store');
    const model = fixtures.setupEvent(store);
    const annotation = store.peekRecord('annotation', 1);

    assert.ok(model.entryInstance);
    assert.equal(store.peekAll('event').get('length'), 1);
    assert.strictEqual(model.entryInstance.get('title'), 'Event1');
    assert.equal(model.entryInstance.get('isNew'), false);
    assert.equal(model.entryInstance.get('hasDirtyAttributes'), false);
    assert.equal(model.entryInstance.get('dirtyType'), undefined);
    assert.equal(model.entryInstance.currentState.stateName, 'root.loaded.saved');

    assert.ok(model.locationInstance);
    assert.equal(model.entryInstance.get('locations.length'), 1);
    assert.equal(store.peekAll('location').get('length'), 1);
    assert.strictEqual(model.locationInstance.get('city'), 'Location1');
    assert.equal(model.locationInstance.get('isNew'), false);
    assert.equal(model.locationInstance.get('hasDirtyAttributes'), false);
    assert.equal(model.locationInstance.get('dirtyType'), undefined);
    assert.equal(model.locationInstance.currentState.stateName, 'root.loaded.saved');

    assert.ok(model.contactInfoInstance);
    assert.equal(model.entryInstance.get('contactInfos.length'), 1);
    assert.equal(store.peekAll('contactInfo').get('length'), 1);
    assert.strictEqual(model.contactInfoInstance.get('contactPerson'), 'Contactinfo1');
    assert.equal(model.contactInfoInstance.get('isNew'), false);
    assert.equal(model.contactInfoInstance.get('hasDirtyAttributes'), false);
    assert.equal(model.contactInfoInstance.get('dirtyType'), undefined);
    assert.equal(model.contactInfoInstance.currentState.stateName, 'root.loaded.saved');

    assert.ok(model.entryInstance.get('annotations'));
    assert.equal(model.entryInstance.get('annotations.length'), 1);
    assert.deepEqual([annotation], model.entryInstance.get('annotations').toArray());
    assert.equal(model.entryInstance.get('hasAnnotationChanges'), false);
  });
});


test('new event properties', function(assert) {
  Ember.run(() => {
    const ctrl = this.subject();
    const store = ctrl.get('store');
    const model = fixtures.setupNewEvent(store);

    assert.ok(model.entryInstance);
    assert.equal(store.peekAll('event').get('length'), 1);
    assert.strictEqual(model.entryInstance.get('title'), undefined, 'title undefined');
    assert.equal(model.entryInstance.get('isNew'), true);
    assert.equal(model.entryInstance.get('hasDirtyAttributes'), true);
    assert.equal(model.entryInstance.get('dirtyType'), 'created');
    assert.equal(model.entryInstance.currentState.stateName, 'root.loaded.created.uncommitted');

    assert.ok(model.locationInstance);
    assert.equal(model.entryInstance.get('locations.length'), 0);
    assert.equal(store.peekAll('location').get('length'), 1);
    assert.strictEqual(model.locationInstance.get('city'), undefined, 'city undefined');
    assert.equal(model.locationInstance.get('isNew'), true);
    assert.equal(model.locationInstance.get('hasDirtyAttributes'), true);
    assert.equal(model.locationInstance.get('dirtyType'), 'created');
    assert.equal(model.locationInstance.currentState.stateName, 'root.loaded.created.uncommitted');

    assert.ok(model.contactInfoInstance);
    assert.equal(model.entryInstance.get('contactInfos.length'), 0);
    assert.equal(store.peekAll('contactInfo').get('length'), 1);
    assert.strictEqual(model.contactInfoInstance.get('contactPerson'), undefined, 'person undefined');
    assert.equal(model.contactInfoInstance.get('isNew'), true);
    assert.equal(model.contactInfoInstance.get('hasDirtyAttributes'), true);
    assert.equal(model.contactInfoInstance.get('dirtyType'), 'created');
    assert.equal(model.contactInfoInstance.currentState.stateName, 'root.loaded.created.uncommitted');

    assert.ok(model.entryInstance.get('annotations'));
    assert.equal(model.entryInstance.get('annotations.length'), 0);
    assert.deepEqual(model.entryInstance.get('annotations').toArray(), [], 'annotations empty');
    assert.equal(model.entryInstance.get('hasAnnotationChanges'), false);
  });
});
