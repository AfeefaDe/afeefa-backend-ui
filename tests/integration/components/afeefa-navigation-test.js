import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('afeefa-navigation', 'Integration | Component | afeefa navigation', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{afeefa-navigation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#afeefa-navigation}}
      template block text
    {{/afeefa-navigation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
