import Ember from 'ember';
import CancelEditEntryControllerMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-controller';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';

moduleFor('mixin:cancel-edit-entry-controller', 'Unit | Mixin | cancel edit entry controller', {
  needs: [
    'controller:application',
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

  assert.strictEqual(false, mixin.hasChanges());
});


test('new event has initially no changes', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');
  Ember.run(() => { mixin.set('model', fixtures.setupNewEvent(store)); });

  assert.strictEqual(false, mixin.hasChanges());
});


function testEventChanges(assert, mixin) {
  // change event attribute
  const entryInstance = mixin.get('model.entryInstance');
  entryInstance.set('title', 'new title');
  assert.strictEqual(true, mixin.hasChanges());
  entryInstance.rollbackAttributes();
  assert.strictEqual(false, mixin.hasChanges());

  // change location attribute
  const locationInstance = mixin.get('model.locationInstance');
  locationInstance.set('city', 'new city');
  assert.strictEqual(true, mixin.hasChanges());
  locationInstance.rollbackAttributes();
  assert.strictEqual(false, mixin.hasChanges());

  // change contact attribute
  const contactInfoInstance = mixin.get('model.contactInfoInstance');
  contactInfoInstance.set('contactPerson', 'new person');
  assert.strictEqual(true, mixin.hasChanges());
  contactInfoInstance.rollbackAttributes();
  assert.strictEqual(false, mixin.hasChanges());

  // change annotation
  entryInstance.set('hasAnnotationChanges', true);
  assert.strictEqual(true, mixin.hasChanges());
  entryInstance.set('hasAnnotationChanges', false);
  assert.strictEqual(false, mixin.hasChanges());
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

  assert.strictEqual(null, mixin.get('oldAnnotations'), 'old annotations empty');

  mixin.modelReady();

  const annotation = store.peekRecord('annotation', 1);
  assert.deepEqual([annotation, annotation2], mixin.get('oldAnnotations'), 'old annotations saved');

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
    assert.strictEqual(false, mixin.hasChanges());

    // check initial state
    const annotation = store.peekRecord('annotation', 1);
    const annotation2 = store.peekRecord('annotation', 2);
    assert.strictEqual(false, mixin.hasChanges());

    assert.strictEqual('Event1', mixin.get('model.entryInstance.title'));
    assert.equal(false, mixin.get('model.entryInstance.isNew'));
    assert.equal(false, mixin.get('model.entryInstance.hasDirtyAttributes'));
    assert.equal(undefined, mixin.get('model.entryInstance.dirtyType'));
    assert.equal('root.loaded.saved', mixin.get('model.entryInstance').currentState.stateName);

    assert.strictEqual('Location1', mixin.get('model.locationInstance.city'));
    assert.equal(false, mixin.get('model.locationInstance.isNew'));
    assert.equal(false, mixin.get('model.locationInstance.hasDirtyAttributes'));
    assert.equal(undefined, mixin.get('model.locationInstance.dirtyType'));
    assert.equal('root.loaded.saved', mixin.get('model.locationInstance').currentState.stateName);

    assert.strictEqual('Contactinfo1', mixin.get('model.contactInfoInstance.contactPerson'));
    assert.equal(false, mixin.get('model.contactInfoInstance.isNew'));
    assert.equal(false, mixin.get('model.contactInfoInstance.hasDirtyAttributes'));
    assert.equal(undefined, mixin.get('model.contactInfoInstance.dirtyType'));
    assert.equal('root.loaded.saved', mixin.get('model.contactInfoInstance').currentState.stateName);

    assert.deepEqual([annotation], mixin.get('model.entryInstance.annotations').toArray());

    // change model
    mixin.set('model.entryInstance.title', 'new title');
    mixin.set('model.locationInstance.city', 'new city');
    mixin.set('model.contactInfoInstance.contactPerson', 'new person');
    mixin.get('model.entryInstance.annotations').removeObject(annotation);
    mixin.get('model.entryInstance.annotations').addObject(annotation2);
    mixin.set('model.entryInstance.hasAnnotationChanges', true);

    // check changes
    assert.strictEqual(true, mixin.hasChanges());

    assert.strictEqual('new title', mixin.get('model.entryInstance.title'));
    assert.equal(false, mixin.get('model.entryInstance.isNew'));
    assert.equal(true, mixin.get('model.entryInstance.hasDirtyAttributes'));
    assert.equal('updated', mixin.get('model.entryInstance.dirtyType'));
    assert.equal('root.loaded.updated.uncommitted', mixin.get('model.entryInstance').currentState.stateName);

    assert.strictEqual('new city', mixin.get('model.locationInstance.city'));
    assert.equal(false, mixin.get('model.entryInstance.isNew'));
    assert.equal(true, mixin.get('model.entryInstance.hasDirtyAttributes'));
    assert.equal('updated', mixin.get('model.entryInstance.dirtyType'));
    assert.equal('root.loaded.updated.uncommitted', mixin.get('model.entryInstance').currentState.stateName);

    assert.strictEqual('new person', mixin.get('model.contactInfoInstance.contactPerson'));
    assert.equal(false, mixin.get('model.contactInfoInstance.isNew'));
    assert.equal(true, mixin.get('model.contactInfoInstance.hasDirtyAttributes'));
    assert.equal('updated', mixin.get('model.contactInfoInstance.dirtyType'));
    assert.equal('root.loaded.updated.uncommitted', mixin.get('model.contactInfoInstance').currentState.stateName);

    assert.deepEqual([annotation2], mixin.get('model.entryInstance.annotations').toArray());

    // rollback and check changes
    mixin.rollback();
    assert.strictEqual(false, mixin.hasChanges());

    assert.strictEqual('Event1', mixin.get('model.entryInstance.title'));
    assert.equal(false, mixin.get('model.entryInstance.isNew'));
    assert.equal(false, mixin.get('model.entryInstance.hasDirtyAttributes'));
    assert.equal(undefined, mixin.get('model.entryInstance.dirtyType'));
    assert.equal('root.loaded.saved', mixin.get('model.entryInstance').currentState.stateName);

    assert.strictEqual('Location1', mixin.get('model.locationInstance.city'));
    assert.equal(false, mixin.get('model.locationInstance.isNew'));
    assert.equal(false, mixin.get('model.locationInstance.hasDirtyAttributes'));
    assert.equal(undefined, mixin.get('model.locationInstance.dirtyType'));
    assert.equal('root.loaded.saved', mixin.get('model.locationInstance').currentState.stateName);

    assert.strictEqual('Contactinfo1', mixin.get('model.contactInfoInstance.contactPerson'));
    assert.equal(false, mixin.get('model.contactInfoInstance.isNew'));
    assert.equal(false, mixin.get('model.contactInfoInstance.hasDirtyAttributes'));
    assert.equal(undefined, mixin.get('model.contactInfoInstance.dirtyType'));
    assert.equal('root.loaded.saved', mixin.get('model.contactInfoInstance').currentState.stateName);

    assert.deepEqual([annotation], mixin.get('model.entryInstance.annotations').toArray());
  });
});


test('rollback on new event works', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    // init controller
    mixin.set('model', fixtures.setupNewEvent(store));
    mixin.modelReady();
    assert.strictEqual(false, mixin.hasChanges());

    // check initial state
    const annotation = store.peekRecord('annotation', 1);
    assert.strictEqual(false, mixin.hasChanges());
    assert.ok(mixin.get('model.entryInstance'));
    assert.ok(mixin.get('model.locationInstance'));
    assert.ok(mixin.get('model.contactInfoInstance'));
    assert.ok(mixin.get('model.entryInstance.annotations'));
    assert.strictEqual(undefined, mixin.get('model.entryInstance.title'), 'title undefined');
    assert.strictEqual(undefined, mixin.get('model.locationInstance.city'), 'city undefined');
    assert.strictEqual(undefined, mixin.get('model.contactInfoInstance.contactPerson'), 'person undefined');
    assert.deepEqual([], mixin.get('model.entryInstance.annotations').toArray(), 'annotations empty');

    // check entry and relations
    assert.equal(store.peekAll('event').get('length'), 1);
    assert.equal(true, mixin.get('model.entryInstance.isNew'));
    assert.equal(true, mixin.get('model.entryInstance.hasDirtyAttributes'));
    assert.equal('created', mixin.get('model.entryInstance.dirtyType'));
    assert.equal('root.loaded.created.uncommitted', mixin.get('model.entryInstance').currentState.stateName);

    assert.equal(store.peekAll('contactInfo').get('length'), 1);
    assert.equal(true, mixin.get('model.locationInstance.isNew'));
    assert.equal(true, mixin.get('model.locationInstance.hasDirtyAttributes'));
    assert.equal('created', mixin.get('model.locationInstance.dirtyType'));
    assert.equal('root.loaded.created.uncommitted', mixin.get('model.locationInstance').currentState.stateName);

    assert.equal(store.peekAll('location').get('length'), 1);
    assert.equal(true, mixin.get('model.contactInfoInstance.isNew'));
    assert.equal(true, mixin.get('model.contactInfoInstance.hasDirtyAttributes'));
    assert.equal('created', mixin.get('model.contactInfoInstance.dirtyType'));
    assert.equal('root.loaded.created.uncommitted', mixin.get('model.contactInfoInstance').currentState.stateName);

    // change model
    mixin.set('model.entryInstance.title', 'new title');
    mixin.set('model.locationInstance.city', 'new city');
    mixin.set('model.contactInfoInstance.contactPerson', 'new person');
    mixin.get('model.entryInstance.annotations').addObject(annotation);
    mixin.set('model.entryInstance.hasAnnotationChanges', true);

    // check changes
    assert.strictEqual(true, mixin.hasChanges());

    assert.strictEqual('new title', mixin.get('model.entryInstance.title'), 'title changed');
    assert.equal(true, mixin.get('model.entryInstance.hasDirtyAttributes'));
    assert.equal('created', mixin.get('model.entryInstance.dirtyType'));
    assert.equal('root.loaded.created.uncommitted', mixin.get('model.entryInstance').currentState.stateName);

    assert.strictEqual('new city', mixin.get('model.locationInstance.city'), 'city changed');
    assert.equal(true, mixin.get('model.locationInstance.isNew'));
    assert.equal(true, mixin.get('model.locationInstance.hasDirtyAttributes'));
    assert.equal('root.loaded.created.uncommitted', mixin.get('model.locationInstance').currentState.stateName);

    assert.strictEqual('new person', mixin.get('model.contactInfoInstance.contactPerson'), 'person changed');
    assert.equal(true, mixin.get('model.contactInfoInstance.isNew'));
    assert.equal(true, mixin.get('model.contactInfoInstance.hasDirtyAttributes'));
    assert.equal('root.loaded.created.uncommitted', mixin.get('model.contactInfoInstance').currentState.stateName);

    assert.deepEqual([annotation], mixin.get('model.entryInstance.annotations').toArray());

    // rollback and check changes
    mixin.rollback();
    assert.strictEqual(false, mixin.hasChanges());
    // check entry and relations are set back
    assert.ok(mixin.get('model.entryInstance'));
    assert.ok(mixin.get('model.locationInstance'));
    assert.ok(mixin.get('model.contactInfoInstance'));
    assert.ok(mixin.get('model.entryInstance.annotations'));
    assert.strictEqual(undefined, mixin.get('model.entryInstance.title'), 'title undefined');
    assert.strictEqual(undefined, mixin.get('model.locationInstance.city'), 'city undefined');
    assert.strictEqual(undefined, mixin.get('model.contactInfoInstance.contactPerson'), 'person undefined');
    assert.deepEqual([], mixin.get('model.entryInstance.annotations').toArray(), 'annotations empty');
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
