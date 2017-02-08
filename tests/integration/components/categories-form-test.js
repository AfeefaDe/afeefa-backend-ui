import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';

moduleForComponent('categories-form', 'Integration | Component | categories form', {
  integration: true,
    beforeEach () {
    this.inject.service('store');
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{forms/categories-form}}`);
  assert.equal(this.$().text().trim(), 'Keine Kategorie ausgewählt');
});

test('it renders the parent categories from the model', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    fixtures.setupCategories(store);
    this.render(hbs`{{forms/categories-form instance=childInstance selectedParentCategory=false}}`);
    assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r)/gm,""), 'Keine Kategorie ausgewählt      Level 1 Category A      Level 1 Category B');
  });
});

test('it renders child categories from a specific parent category', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    fixtures.setupCategories(store);
    let topLevelCategory = this.get('store').peekRecord('category', 1);
    this.set('topLevelCategory', topLevelCategory);
    this.render(hbs`{{forms/categories-form instance=childInstance selectedParentCategory=topLevelCategory}}`);
    assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r)/gm,""), 'Keine Kategorie ausgewählt      Level 2 Category A      Level 2 Category B');
  });
});

test('it sets the parent category on the entry', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    fixtures.setupCategories(store);
    this.set('model', fixtures.setupEvent(store));
    this.render(hbs`{{forms/categories-form instance=model.entryInstance.category selectedParentCategory=false}}`);
    /* select category with id 1 */
    $('.categoriesForm').val('1').trigger('change');
    assert.equal(1, this.get('model.entryInstance.category.id'));
    /* select "Keine Kategorie"*/
    $('.categoriesForm').val('-1').trigger('change');
    assert.strictEqual(undefined, this.get('model.entryInstance.category.id'));
  });
});
