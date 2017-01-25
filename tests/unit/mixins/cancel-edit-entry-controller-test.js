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
    'model:location'
  ],

  beforeEach () {
    let CancelEditEntryControllerObject = Ember.Object.extend(CancelEditEntryControllerMixin);
    const mixin = CancelEditEntryControllerObject.create();
    mixin.set('store', Ember.getOwner(this).lookup('service:store'));
    this.subject = () => mixin;
  }
});


test('model has initially no changes', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  Ember.run(function () {
    mixin.set('model', fixtures.setupEvent(store));
  });

  assert.strictEqual(false, mixin.hasChanges());
});


test('mixin detect changes', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');
  Ember.run(function () {
    mixin.set('model', fixtures.setupEvent(store));
  });

  // change event attribute
  const entryInstance = mixin.get('model.entryInstance');
  Ember.run(function () {
    entryInstance.set('title', 'new title');
  });
  assert.strictEqual(true, mixin.hasChanges());
  Ember.run(function () {
    entryInstance.rollbackAttributes();
  });
  assert.strictEqual(false, mixin.hasChanges());

  // change location attribute
  const locationInstance = mixin.get('model.locationInstance');
  Ember.run(function () {
    locationInstance.set('city', 'new city');
  });
  assert.strictEqual(true, mixin.hasChanges());
  Ember.run(function () {
    locationInstance.rollbackAttributes();
  });
  assert.strictEqual(false, mixin.hasChanges());

  // change contact attribute
  const contactInfoInstance = mixin.get('model.contactInfoInstance');
  Ember.run(function () {
    contactInfoInstance.set('contactPerson', 'new person');
  });
  assert.strictEqual(true, mixin.hasChanges());
  Ember.run(function () {
    contactInfoInstance.rollbackAttributes();
  });
  assert.strictEqual(false, mixin.hasChanges());

  // change annotation
  entryInstance.set('hasAnnotationChanges', true);
  assert.strictEqual(true, mixin.hasChanges());
  entryInstance.set('hasAnnotationChanges', false);
  assert.strictEqual(false, mixin.hasChanges());
});


test('mixin saves existing annotations on init', function(assert) {
  const mixin = this.subject();
  const store = mixin.get('store');

  // two annotations
  Ember.run(function () {
    mixin.set('model', fixtures.setupEvent(store));
  });
  const annotation2 = store.peekRecord('annotation', 2);
  mixin.get('model.entryInstance.annotations').pushObject(annotation2);

  assert.strictEqual(null, mixin.get('oldAnnotations'), 'old annotations empty');

  mixin.modelReady();

  const annotation = store.peekRecord('annotation', 1);
  assert.deepEqual([annotation, annotation2], mixin.get('oldAnnotations'), 'old annotations saved');

  // no annotation
  Ember.run(function () {
    mixin.set('model', fixtures.setupEvent(store));
  });
  mixin.get('model.entryInstance.annotations').clear();

  mixin.modelReady();

  assert.deepEqual([], mixin.get('oldAnnotations'), 'old annotations saved');
});
