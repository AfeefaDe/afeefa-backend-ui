import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';

moduleForComponent('forms/categories-wrapper', 'Integration | Component | categories wrapper', {
  integration: true,
  beforeEach () {
    this.inject.service('store');
  }
});

test('it renders', function(assert) {
  Ember.run(()=> {
    const store = this.get('store');
    fixtures.setupCategories(store);
    this.set('model', fixtures.setupEvent(store));
    this.render(hbs`{{forms/categories-wrapper parentInstance=model.entryInstance.category childInstance=model.entryInstance.subCategory}}`);
    assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r)/gm,""), 'Kategorie (Pflichtfeld)    Keine Kategorie ausgewählt      Level 1 Category A      Level 1 Category B');
  });
});

test('it shows the child category input after selecting a prent category', function(assert) {
  Ember.run(()=> {
    const store = this.get('store');
    fixtures.setupCategories(store);
    this.set('model', fixtures.setupEvent(store));
    this.render(hbs`{{forms/categories-wrapper parentInstance=model.entryInstance.category childInstance=model.entryInstance.subCategory}}`);
    //there is one input for selecting the parent category
    assert.equal(this.$('.categoriesForm').length, 1);
    //okay, this is undefined: this.get('parentInstance.id'));
    //next: select parent category
    $('.categoriesForm').val('1').trigger('change');

    //I am excepting two inputs and a set id on the instance:
    //assert.equal(this.$('.categoriesForm').length, 2);
    //assert.equal(this.get('model.entryInstance.category.id'), 1)
  })

});

test('it removes the child category after changing the parent category', function(assert) {
  assert.equal(true, true);
});










