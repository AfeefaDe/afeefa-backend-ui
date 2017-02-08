import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('time-picker', 'Integration | Component | time picker', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{time-picker onChange=null}}`);

  assert.equal(this.$().text().trim(), '');

});
