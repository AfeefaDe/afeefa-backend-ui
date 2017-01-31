import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';

moduleForComponent('date-picker', 'Integration | Component | date picker', {
  integration: true,

  beforeEach () {
    this.inject.service('store');
  }
});

test('it renders', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    this.set('model', fixtures.setupEvent(store));

    this.render(hbs`{{date-picker model=model}}`);

    assert.equal(this.$('button').eq(0).text().trim(), 'event');
  });
});
