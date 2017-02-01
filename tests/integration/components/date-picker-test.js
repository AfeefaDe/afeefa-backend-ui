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
    assert.equal(this.$('button').length, 4);
  });

});

test('if start date is set in the model, it is shown', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    this.set('model', fixtures.setupEvent(store));

    const currentDay = new Date(2017, 1, 28);
    this.set('model.entryInstance.date_start', currentDay);
    this.render(hbs`{{date-picker model=model}}`);
    assert.equal(this.$('#startDate').val(), '28.02.2017');

    // console.log(this.$().html());
    // console.log(this.$('#startDate').html());
    // console.log(this.get('model.entryInstance'));
  });
});
