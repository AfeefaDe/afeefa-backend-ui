import { definesAttribute, hasAttribute } from 'afeefa-backend-ui/helpers/has-attribute';
import test from 'ember-sinon-qunit/test-support/test';
import { moduleFor } from 'ember-qunit';
import DS from 'ember-data';

let store;

moduleFor('helper:has-attribute', 'Unit | Helper | has attribute', {
  beforeEach() {
    const owner = Ember.getOwner(this);
    store = owner.lookup('service:store');

    const Artist = DS.Model.extend({
      name: DS.attr('string')
    });
    owner.register('model:artist', Artist);
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  let result = hasAttribute([42]);
  assert.ok(result);
});


test('defines attribute works', function(assert) {
  Ember.run(() => {
    let artist = store.createRecord('artist');
    assert.ok(definesAttribute(artist, 'name'));
    assert.strictEqual(artist.get('name'), undefined);
    assert.notOk(definesAttribute(artist, 'titel'));
  });
});
