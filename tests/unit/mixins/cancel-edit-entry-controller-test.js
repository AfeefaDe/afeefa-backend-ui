import Ember from 'ember';
import CancelEditEntryControllerMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-controller';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';

moduleFor('mixin:cancel-edit-entry-controller', 'Unit | Mixin | cancel edit entry controller', {
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
    let CancelEditEntryControllerObject = Ember.Object.extend(CancelEditEntryControllerMixin);
    const mixin = CancelEditEntryControllerObject.create();
    mixin.set('store', Ember.getOwner(this).lookup('service:store'));
    this.subject = () => mixin;
  }
});


test('existing event has initially no changes', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');
  Ember.run(() => { mixin.set('model', fixtures.setupEvent(store)); });

  assert.strictEqual(mixin.hasChanges(), false);
});


test('new event has initially no changes', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');
  Ember.run(() => { mixin.set('model', fixtures.setupNewEvent(store)); });

  assert.strictEqual(mixin.hasChanges(), false);
});


function testEventChanges(assert, mixin) {
  // change event attribute
  const entryInstance = mixin.get('model.entryInstance');
  entryInstance.set('title', 'new title');
  assert.strictEqual(mixin.hasChanges(), true);
  entryInstance.rollbackAttributes();
  assert.strictEqual(mixin.hasChanges(), false);

  // change location attribute
  const locationInstance = mixin.get('model.locationInstance');
  locationInstance.set('city', 'new city');
  assert.strictEqual(mixin.hasChanges(), true);
  locationInstance.rollbackAttributes();
  assert.strictEqual(mixin.hasChanges(), false);

  // change contact attribute
  const contactInfoInstance = mixin.get('model.contactInfoInstance');
  contactInfoInstance.set('contactPerson', 'new person');
  assert.strictEqual(mixin.hasChanges(), true);
  contactInfoInstance.rollbackAttributes();
  assert.strictEqual(mixin.hasChanges(), false);

  // change annotation
  entryInstance.set('hasAnnotationChanges', true);
  assert.strictEqual(mixin.hasChanges(), true);
  entryInstance.set('hasAnnotationChanges', false);
  assert.strictEqual(mixin.hasChanges(), false);
}


test('mixin detect changes on existing', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');
  Ember.run(() => { mixin.set('model', fixtures.setupEvent(store)); });

  Ember.run(() => { testEventChanges(assert, mixin); });
});


test('mixin detect changes on new event', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');
  Ember.run(() => { mixin.set('model', fixtures.setupNewEvent(store)); });

  Ember.run(() => { testEventChanges(assert, mixin); });
});


test('mixin saves existing annotations on modelReady', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  // two annotations
  Ember.run(() => { mixin.set('model', fixtures.setupEvent(store)); });
  const annotation2 = store.peekRecord('annotation', 2);
  mixin.get('model.entryInstance.annotations').pushObject(annotation2);

  assert.strictEqual(mixin.get('oldAnnotations'), null, 'old annotations empty');

  mixin.modelReady();

  const annotation = store.peekRecord('annotation', 1);
  assert.deepEqual(mixin.get('oldAnnotations'), [annotation, annotation2], 'old annotations saved');

  // no annotation
  Ember.run(() => { mixin.set('model', fixtures.setupEvent(store)); });
  mixin.get('model.entryInstance.annotations').clear();

  mixin.modelReady();

  assert.deepEqual([], mixin.get('oldAnnotations'), 'old annotations saved');
});


test('rollback on existing event works', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    // init controller
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();
    assert.strictEqual(mixin.hasChanges(), false);

    // check initial state
    const annotation = store.peekRecord('annotation', 1);
    const annotation2 = store.peekRecord('annotation', 2);
    assert.strictEqual(mixin.hasChanges(), false);
    // fixture integrity tested in fixtures-test
    // ...

    // change model
    mixin.set('model.entryInstance.title', 'new title');
    mixin.set('model.locationInstance.city', 'new city');
    mixin.set('model.contactInfoInstance.contactPerson', 'new person');
    mixin.get('model.entryInstance.annotations').removeObject(annotation);
    mixin.get('model.entryInstance.annotations').addObject(annotation2);
    mixin.set('model.entryInstance.hasAnnotationChanges', true);

    // check changes
    assert.strictEqual(mixin.hasChanges(), true);

    assert.strictEqual(mixin.get('model.entryInstance.title'), 'new title');
    assert.equal(mixin.get('model.entryInstance.isNew'), false);
    assert.equal(mixin.get('model.entryInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.entryInstance.dirtyType'), 'updated');
    assert.equal(mixin.get('model.entryInstance').currentState.stateName, 'root.loaded.updated.uncommitted');

    assert.strictEqual(mixin.get('model.locationInstance.city'), 'new city');
    assert.equal(mixin.get('model.entryInstance.isNew'), false);
    assert.equal(mixin.get('model.entryInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.entryInstance.dirtyType'), 'updated');
    assert.equal(mixin.get('model.entryInstance').currentState.stateName, 'root.loaded.updated.uncommitted');

    assert.strictEqual(mixin.get('model.contactInfoInstance.contactPerson'), 'new person');
    assert.equal(mixin.get('model.contactInfoInstance.isNew'), false);
    assert.equal(mixin.get('model.contactInfoInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.contactInfoInstance.dirtyType'), 'updated');
    assert.equal(mixin.get('model.contactInfoInstance').currentState.stateName, 'root.loaded.updated.uncommitted');

    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [annotation2]);
    assert.equal(true, mixin.get('model.entryInstance.hasAnnotationChanges'));

    // rollback and check changes
    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);

    assert.strictEqual(mixin.get('model.entryInstance.title'), 'Event1');
    assert.equal(mixin.get('model.entryInstance.isNew'), false);
    assert.equal(mixin.get('model.entryInstance.hasDirtyAttributes'), false);
    assert.equal(mixin.get('model.entryInstance.dirtyType'), undefined);
    assert.equal(mixin.get('model.entryInstance').currentState.stateName, 'root.loaded.saved');

    assert.strictEqual(mixin.get('model.locationInstance.city'), 'Location1');
    assert.equal(mixin.get('model.locationInstance.isNew'), false);
    assert.equal(mixin.get('model.locationInstance.hasDirtyAttributes'), false);
    assert.equal(mixin.get('model.locationInstance.dirtyType'), undefined);
    assert.equal(mixin.get('model.locationInstance').currentState.stateName, 'root.loaded.saved');

    assert.strictEqual(mixin.get('model.contactInfoInstance.contactPerson'), 'Contactinfo1');
    assert.equal(mixin.get('model.contactInfoInstance.isNew'), false);
    assert.equal(mixin.get('model.contactInfoInstance.hasDirtyAttributes'), false);
    assert.equal(mixin.get('model.contactInfoInstance.dirtyType'), undefined);
    assert.equal(mixin.get('model.contactInfoInstance').currentState.stateName, 'root.loaded.saved');

    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [annotation]);
    assert.equal(false, mixin.get('model.entryInstance.hasAnnotationChanges'));
  });
});


test('rollback on new event works', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    // init controller
    mixin.set('model', fixtures.setupNewEvent(store));
    mixin.modelReady();
    assert.strictEqual(mixin.hasChanges(), false);

    // check initial state
    const annotation = store.peekRecord('annotation', 1);
    assert.strictEqual(mixin.hasChanges(), false);
    // fixture integrity tested in fixtures-test
    // ...

    // change model
    mixin.set('model.entryInstance.title', 'new title');
    mixin.set('model.locationInstance.city', 'new city');
    mixin.set('model.contactInfoInstance.contactPerson', 'new person');
    mixin.get('model.entryInstance.annotations').addObject(annotation);
    mixin.set('model.entryInstance.hasAnnotationChanges', true);

    // check changes
    assert.strictEqual(mixin.hasChanges(), true);

    assert.strictEqual(mixin.get('model.entryInstance.title'), 'new title', 'title changed');
    assert.equal(mixin.get('model.entryInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.entryInstance.dirtyType'), 'created');
    assert.equal(mixin.get('model.entryInstance').currentState.stateName, 'root.loaded.created.uncommitted');

    assert.strictEqual(mixin.get('model.locationInstance.city'), 'new city', 'city changed');
    assert.equal(mixin.get('model.locationInstance.isNew'), true);
    assert.equal(mixin.get('model.locationInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.locationInstance').currentState.stateName, 'root.loaded.created.uncommitted');

    assert.strictEqual(mixin.get('model.contactInfoInstance.contactPerson'), 'new person', 'person changed');
    assert.equal(mixin.get('model.contactInfoInstance.isNew'), true);
    assert.equal(mixin.get('model.contactInfoInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.contactInfoInstance').currentState.stateName, 'root.loaded.created.uncommitted');

    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [annotation]);
    assert.equal(true, mixin.get('model.entryInstance.hasAnnotationChanges'));

    // rollback and check changes
    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    // check entry and relations are set back
    assert.ok(mixin.get('model.entryInstance'));
    assert.ok(mixin.get('model.locationInstance'));
    assert.ok(mixin.get('model.contactInfoInstance'));
    assert.ok(mixin.get('model.entryInstance.annotations'));
    assert.strictEqual(mixin.get('model.entryInstance.title'), undefined, 'title undefined');
    assert.strictEqual(mixin.get('model.locationInstance.city'), undefined, 'city undefined');
    assert.strictEqual(mixin.get('model.contactInfoInstance.contactPerson'), undefined, 'person undefined');
    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [], 'annotations empty');
    assert.equal(mixin.get('model.entryInstance.hasAnnotationChanges'), false);
    // check entry and relations are removed from store
    // wait for store to cleanup all
    Ember.run.next(this, function() {
      assert.equal(store.peekAll('event').get('length'), 0, 'event removed');
      assert.equal(store.peekAll('contactInfo').get('length'), 0, 'contact info removed');
      assert.equal(store.peekAll('location').get('length'), 0, 'location removed');
    });
  });
});

test('cancel routes back if no changes', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    // init controller
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    const goBackSpy = this.spy();
    mixin.rollback = this.spy();
    mixin.showCancelDialog = this.spy();
    mixin.set('historyService', { goBack: goBackSpy });

    mixin.actions.cancel.call(mixin);

    assert.ok(goBackSpy.calledOnce);
    assert.ok(mixin.rollback.calledOnce);
    assert.ok(mixin.showCancelDialog.notCalled);
  });
});


test('cancel without changes routes back without dialog', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));

    const goBackSpy = this.spy();
    mixin.rollback = this.spy();
    mixin.showCancelDialog = this.spy();
    mixin.set('historyService', { goBack: goBackSpy });

    mixin.actions.cancel.call(mixin);

    assert.ok(goBackSpy.calledOnce);
    assert.ok(mixin.rollback.calledOnce);
    assert.ok(mixin.showCancelDialog.notCalled);
  });
});


test('cancel with changes raises dialog', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));

    const goBackSpy = this.spy();
    mixin.rollback = this.spy();
    mixin.showCancelDialog = this.spy();
    mixin.set('historyService', { goBack: goBackSpy });

    mixin.set('model.entryInstance.title', 'new title');
    mixin.actions.cancel.call(mixin);

    assert.ok(goBackSpy.notCalled);
    assert.ok(mixin.rollback.notCalled);
    assert.ok(mixin.showCancelDialog.calledOnce);
  });
});


test('confirm dialog calls rollback and routes back', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));

    const goBackSpy = this.spy();
    mixin.rollback = this.spy();
    mixin.showCancelDialog = yes => yes();
    mixin.set('historyService', { goBack: goBackSpy });

    mixin.set('model.entryInstance.title', 'new title');
    mixin.actions.cancel.call(mixin);

    assert.ok(goBackSpy.calledOnce);
    assert.ok(mixin.rollback.calledOnce);
  });
});
