import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('forms/categories-wrapper', 'Integration | Component | forms/categories wrapper', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{forms/categories-wrapper}}`);
  assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r)/gm,""), 'Kategorie (Pflichtfeld)    Keine Kategorie ausgewählt');
});
