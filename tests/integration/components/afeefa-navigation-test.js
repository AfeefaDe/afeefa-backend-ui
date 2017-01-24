import Ember from 'ember';
import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('afeefa-navigation', 'Integration | Component | afeefa navigation', {
  integration: true,

  beforeEach: function () {
    this.inject.service('navigation', {as: 'navigationService'});
    this.inject.service('event-bus', {as: 'EventBus'});

    // make the router handling our link-to handlebars
    let owner = Ember.getOwner(this);
    const router = owner.lookup('router:main');
    router.startRouting(true);
  }
});


test('it renders', function(assert) {
  this.render(hbs`{{afeefa-navigation}}`);
  assert.equal('menu', this.$('#btn-sandwich').text().trim());
  assert.equal(0, this.$('#breadcrumb').children().length, 'no sub elements in path navigation');
  assert.strictEqual(undefined, this.$('#menu').html(), 'no menu shown initially');
});


test('it updates on navigation service change', function(assert) {
  const navigationService = this.get('navigationService');

  this.render(hbs`{{afeefa-navigation}}`);
  assert.equal(0, this.$('#breadcrumb').children().length);

  this.stub(navigationService, 'getPathNavigation').returns([
    { route: 'protected.dashboard', title: 'Dashboard'},
    { route: null, title: 'Orgas'}
  ]);

  Ember.run(() => {
    navigationService.trigger('change');
  });

  assert.equal(3, this.$('#breadcrumb').children().length); // two items and one chevron
});


test('it shows the right items in path navigation', function(assert) {
  const navigationService = this.get('navigationService');

  this.stub(navigationService, 'getPathNavigation').returns([
    { route: 'protected.dashboard', title: 'Dashboard'},
    { route: 'protected.orgas', title: 'Orgas'},
    { route: null, title: 'Anzeigen'}
  ]);

  this.render(hbs`{{afeefa-navigation}}`);

  assert.equal(5, this.$('#breadcrumb').children().length);

  assert.equal('A', this.$('#breadcrumb').children().eq(0).prop('tagName'));
  assert.equal('Dashboard', this.$('#breadcrumb').children().eq(0).text());
  assert.equal('/', this.$('#breadcrumb').children().eq(0).attr('href'));

  assert.equal('I', this.$('#breadcrumb').children().eq(1).prop('tagName'));
  assert.equal('chevron_right', this.$('#breadcrumb').children().eq(1).text());

  assert.equal('A', this.$('#breadcrumb').children().eq(2).prop('tagName'));
  assert.equal('Orgas', this.$('#breadcrumb').children().eq(2).text());
  assert.equal('/orgas', this.$('#breadcrumb').children().eq(2).attr('href'));

  assert.equal('I', this.$('#breadcrumb').children().eq(3).prop('tagName'));
  assert.equal('chevron_right', this.$('#breadcrumb').children().eq(3).text());

  assert.equal('SPAN', this.$('#breadcrumb').children().eq(4).prop('tagName'));
  assert.equal('Anzeigen', this.$('#breadcrumb').children().eq(4).text());
});


test('it toggles the menu', function(assert) {
  this.render(hbs`{{afeefa-navigation}}`);

  assert.equal(0, this.$('#menu').children().length);

  this.$('#btn-sandwich').click();

  assert.equal(6, this.$('#menu').children().length);

  Ember.run(() => {
    this.get('EventBus').publish('willTransition');
  });

  assert.equal(0, this.$('#menu').children().length);
});


test('it shows the right items in menu navigation', function(assert) {
  this.render(hbs`{{afeefa-navigation}}`);
  this.$('#btn-sandwich').click();

  assert.equal(6, this.$('#menu').children().length);

  const check = (index, title, url) => {
    assert.equal('A', this.$('#menu').children().eq(index).prop('tagName'));
    assert.equal(title, this.$('#menu').children().eq(index).text());
    assert.equal(url, this.$('#menu').children().eq(index).attr('href'));
  };

  check(0, 'Dashboard', '/');
  check(1, 'Todos', '/todos');
  check(2, 'Orgas', '/orgas');
  check(3, 'Events', '/events');
  check(4, 'Suche', '/search');
  check(5, 'Login', '/login');
});
