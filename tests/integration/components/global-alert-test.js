import { moduleForComponent, test } from 'ember-qunit';
// import hbs from 'htmlbars-inline-precompile';

moduleForComponent('global-alert', 'Integration | Component | global alert', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  // this.render(hbs`{{global-alert}}`);

  // assert.equal(this.$().text().trim(), '');
  assert.equal('', '');

  //
  // // Template block usage:
  // this.render(hbs`
  //   {{#global-alert}}
  //     template block text
  //   {{/global-alert}}
  // `);
  //
  // assert.equal(this.$().text().trim(), 'template block text');
});
