import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('contact-info-form', 'Integration | Component | contact info form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{forms/contact-info-form instance=contactInfo}}}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#contact-info-form}}
      template block text
    {{/contact-info-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
