import Ember from 'ember';
import CancelEditEntryControllerMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-controller';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';
import QUnit from 'qunit';

QUnit.dump.maxDepth = 2;

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
  mixin.modelReady();

  assert.strictEqual(mixin.hasChanges(), false);
});


test('new event has initially no changes', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');
  Ember.run(() => { mixin.set('model', fixtures.setupNewEvent(store)); });
  mixin.modelReady();

  assert.strictEqual(mixin.hasChanges(), false);
});


test('mixin detects and rollbacks changes on event', function(assert) {
  Ember.run(() => {
    const mixin = this.subject();
    const store = mixin.get('store');

    /* event attribute */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    let entryInstance = mixin.get('model.entryInstance');
    entryInstance.set('title', 'new title');
    assert.strictEqual(mixin.hasChanges(), true);
    assert.equal(entryInstance.get('title'), 'new title');

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.equal(entryInstance.get('title'), 'Event1');

    /* event date (new date instance) */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    entryInstance = mixin.get('model.entryInstance');
    entryInstance.set('date_start', new Date(2015, 5, 4));
    assert.strictEqual(mixin.hasChanges(), true);
    assert.equal(entryInstance.get('date_start').toString(), new Date(2015, 5, 4).toString());

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.equal(entryInstance.get('date_start').toString(), new Date(2017, 1, 28).toString());

    /* event date (changed date instance) */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    entryInstance = mixin.get('model.entryInstance');
    const date = entryInstance.get('date_start');
    date.setDate(28);
    date.setMonth(6);
    date.setFullYear(2013);

    assert.strictEqual(mixin.hasChanges(), true);
    assert.equal(entryInstance.get('date_start').toString(), new Date(2013, 6, 28).toString(), 'current date value changed');

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.equal(entryInstance.get('date_start').toString(), new Date(2017, 1, 28).toString());

    /* location attribute */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    const locationInstance = mixin.get('model.locationInstance');
    locationInstance.set('city', 'new city');
    assert.strictEqual(mixin.hasChanges(), true);
    assert.equal(locationInstance.get('city'), 'new city');

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.equal(locationInstance.get('city'), 'Location1');

    /* contact attribute */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    const contactInfoInstance = mixin.get('model.contactInfoInstance');
    contactInfoInstance.set('contactPerson', 'new person');
    assert.strictEqual(mixin.hasChanges(), true);
    assert.equal(contactInfoInstance.get('contactPerson'), 'new person');

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.equal(contactInfoInstance.get('contactPerson'), 'Contactinfo1');

    /* annotation */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();
    let annotation = store.peekRecord('annotation', 1);
    const annotation2 = store.peekRecord('annotation', 2);

    mixin.get('model.entryInstance.annotations').pushObject(annotation2);
    assert.strictEqual(mixin.hasChanges(), true);
    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [annotation, annotation2]);

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [annotation]);

    /* annotation2 remove sole annotation */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();
    annotation = store.peekRecord('annotation', 1);

    mixin.get('model.entryInstance.annotations').removeObject(annotation);
    assert.strictEqual(mixin.hasChanges(), true, 'has annotation2 changes');
    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), []);

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [annotation]);

    /* orga */

    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    const orga = store.peekRecord('orga', 1);
    const orga2 = store.peekRecord('orga', 2);

    mixin.get('model.entryInstance').set('orga', orga2);
    assert.strictEqual(mixin.hasChanges(), true);
    assert.strictEqual(mixin.get('model.entryInstance.orga').content, orga2);

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.strictEqual(mixin.get('model.entryInstance.orga').content, orga);

    /* categories */

    fixtures.setupCategories(store);
    mixin.set('model', fixtures.setupEvent(store));
    // setup initial categories
    const category = store.peekRecord('category', 1);
    const subCategory = store.peekRecord('category', 3);
    mixin.get('model.entryInstance').set('category', category);
    mixin.get('model.entryInstance').set('subCategory', subCategory);
    mixin.modelReady();

    const category2 = store.peekRecord('category', 2);
    const subCategory2 = store.peekRecord('category', 4);
    mixin.get('model.entryInstance').set('category', category2);
    mixin.get('model.entryInstance').set('subCategory', subCategory2);
    assert.strictEqual(mixin.hasChanges(), true);
    assert.strictEqual(mixin.get('model.entryInstance.category').content, category2);
    assert.strictEqual(mixin.get('model.entryInstance.subCategory').content, subCategory2);

    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    assert.strictEqual(mixin.get('model.entryInstance.category').content, category);
    assert.strictEqual(mixin.get('model.entryInstance.subCategory').content, subCategory);
  });
});


test('mixin saves existing annotations on modelReady', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  // console.log(mixin.get('oldRelationsCache'));
  // two annotations
  Ember.run(() => { mixin.set('model', fixtures.setupEvent(store)); });

  const annotation2 = store.peekRecord('annotation', 2);
  mixin.get('model.entryInstance.annotations').pushObject(annotation2);

  // console.log(mixin.get('oldRelationsCache'));
  assert.strictEqual(mixin.get('oldRelationsCache').annotations, undefined, 'old annotations empty');

  mixin.modelReady();

  const annotation = store.peekRecord('annotation', 1);
  assert.deepEqual(mixin.get('oldRelationsCache').annotations, [annotation, annotation2], 'old annotations saved');

  // no annotation
  Ember.run(() => { mixin.set('model', fixtures.setupEvent(store)); });
  mixin.modelReady();
  mixin.get('model.entryInstance.annotations').clear();

  mixin.modelReady();

  assert.deepEqual([], mixin.get('oldRelationsCache').annotations, 'old annotations saved');
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

    // check changes
    assert.strictEqual(mixin.hasChanges(), true);

    assert.strictEqual(mixin.get('model.entryInstance.title'), 'new title');
    assert.equal(mixin.get('model.entryInstance.isNew'), false);
    assert.equal(mixin.get('model.entryInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.entryInstance.dirtyType'), 'updated');
    assert.equal(mixin.get('model.entryInstance').currentState.stateName, 'root.loaded.updated.uncommitted');

    assert.strictEqual(mixin.get('model.locationInstance.city'), 'new city');
    assert.equal(mixin.get('model.locationInstance.isNew'), false);
    assert.equal(mixin.get('model.locationInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.locationInstance.dirtyType'), 'updated');
    assert.equal(mixin.get('model.locationInstance').currentState.stateName, 'root.loaded.updated.uncommitted');

    assert.strictEqual(mixin.get('model.contactInfoInstance.contactPerson'), 'new person');
    assert.equal(mixin.get('model.contactInfoInstance.isNew'), false);
    assert.equal(mixin.get('model.contactInfoInstance.hasDirtyAttributes'), true);
    assert.equal(mixin.get('model.contactInfoInstance.dirtyType'), 'updated');
    assert.equal(mixin.get('model.contactInfoInstance').currentState.stateName, 'root.loaded.updated.uncommitted');

    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [annotation2]);

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
  });
});


test('rollback on new event works', function(assert) {
  Ember.run(() => {
    const mixin = this.subject();
    const store = mixin.get('store');
    // init controller
    mixin.set('model', fixtures.setupNewEvent(store));
    mixin.modelReady();
    // assert.strictEqual(mixin.hasChanges(), false);

    // check initial state
    const annotation = store.peekRecord('annotation', 1);
    // assert.strictEqual(mixin.hasChanges(), false);
    // fixture integrity tested in fixtures-test
    // ...

    // change model
    mixin.set('model.entryInstance.title', 'new title');
    mixin.set('model.locationInstance.city', 'new city');
    mixin.set('model.contactInfoInstance.contactPerson', 'new person');
    mixin.get('model.entryInstance.annotations').addObject(annotation);

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

    // rollback and check changes
    mixin.rollback();
    assert.strictEqual(mixin.hasChanges(), false);
    // check entry and relations are set back
    assert.ok(mixin.get('model.entryInstance'), 'entry exists');
    assert.ok(mixin.get('model.locationInstance'), 'location exists');
    assert.ok(mixin.get('model.contactInfoInstance'), 'contact exists');
    assert.ok(mixin.get('model.entryInstance.annotations'), 'annotations exist');
    assert.strictEqual(mixin.get('model.entryInstance.title'), undefined, 'title undefined');
    assert.strictEqual(mixin.get('model.locationInstance.city'), undefined, 'city undefined');
    assert.strictEqual(mixin.get('model.contactInfoInstance.contactPerson'), undefined, 'person undefined');
    assert.deepEqual(mixin.get('model.entryInstance.annotations').toArray(), [], 'annotations empty');
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


test('cancel with changes raises dialog', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

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


test('change route with changes raises dialog', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    const transitionMock = {
      retry: this.spy(),
      abort: this.spy()
    };
    mixin.rollback = this.spy();
    mixin.showCancelDialog = this.spy();

    mixin.set('model.entryInstance.title', 'new title');
    mixin.willTransition(transitionMock);

    assert.ok(transitionMock.abort.calledOnce);
    assert.ok(transitionMock.retry.notCalled);
    assert.ok(mixin.rollback.notCalled);
    assert.ok(mixin.showCancelDialog.calledOnce);
  });
});


test('change route with changes does not raise dialog after save', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    const transitionMock = {
      retry: this.spy(),
      abort: this.spy()
    };
    mixin.rollback = this.spy();
    mixin.showCancelDialog = this.spy();

    mixin.set('model.entryInstance.title', 'new title');
    mixin.set('justSaved', true);
    mixin.willTransition(transitionMock);

    assert.ok(transitionMock.abort.notCalled);
    assert.ok(mixin.showCancelDialog.notCalled);
    assert.ok(mixin.rollback.notCalled);
    assert.equal(mixin.get('justSaved'), false);
  });
});


test('calling justSave on the model sets property to mixin', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    assert.equal(mixin.get('justSaved'), false);

    const entry = mixin.get('model.entryInstance');
    entry.__SAVED();

    assert.equal(mixin.get('justSaved'), true);
  });
});


test('confirm cancel dialog calls rollback and routes back', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

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


test('confirm transition dialog calls rollback and transitions', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(() => {
    mixin.set('model', fixtures.setupEvent(store));
    mixin.modelReady();

    const transitionMock = {
      retry: this.spy(),
      abort: this.spy()
    };
    mixin.rollback = this.spy();
    mixin.showCancelDialog = yes => yes();

    mixin.set('model.entryInstance.title', 'new title');
    mixin.willTransition(transitionMock);

    assert.ok(transitionMock.abort.calledOnce);
    assert.ok(transitionMock.retry.calledOnce);
    assert.ok(mixin.rollback.calledOnce);
  });
});
