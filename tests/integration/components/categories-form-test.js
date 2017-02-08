import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('categories-form', 'Integration | Component | categories form', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{forms/categories-form}}`);
  assert.equal(this.$().text().trim(), 'Keine Kategorie ausgewählt');
});
