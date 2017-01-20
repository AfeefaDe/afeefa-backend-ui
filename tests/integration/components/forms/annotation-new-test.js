import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('forms/annotation-new', 'Integration | Component | forms/annotation new', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{forms/annotation-new}}`);

  assert.equal(this.$().text().trim(), 'Neue Anmerkung hinzufügen');

  // Template block usage:
  // this.render(hbs`
  //   {{#forms/annotation-new}}
  //     template block text
  //   {{/forms/annotation-new}}
  // `);
  //
  // assert.equal(this.$().text().trim(), 'template block text');
});
