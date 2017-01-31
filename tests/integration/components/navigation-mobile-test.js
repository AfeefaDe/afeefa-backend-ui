import Ember from 'ember';
import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('navigation-mobile', 'Integration | Component | navigation mobile', {
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
  this.render(hbs`{{navigation-mobile EventBus=EventBus}}`);
  assert.equal('menu', this.$('#btn-sandwich').text().trim());
  assert.equal(0, this.$('.navigationBreadcrumb').children().length, 'no sub elements in path navigation');
  assert.strictEqual(undefined, this.$('#menu').html(), 'no menu shown initially');
});


test('it updates on navigation service change', function(assert) {
  const navigationService = this.get('navigationService');

  this.render(hbs`{{navigation-mobile EventBus=EventBus}}`);
  assert.equal(0, this.$('.navigationBreadcrumb').children().length);

  this.stub(navigationService, 'getPathNavigation').returns([
    { route: 'protected.dashboard', title: 'Dashboard'},
    { route: null, title: 'Orgas'}
  ]);

  Ember.run(() => {
    navigationService.trigger('change');
  });

  assert.equal(this.$('.navigationBreadcrumb').children().length, 3); // two items and one chevron
});


test('it shows the right items in path navigation', function(assert) {
  const navigationService = this.get('navigationService');
  this.stub(navigationService, 'getPathNavigation').returns([
    { route: 'protected.dashboard', title: 'Dashboard'},
    { route: 'protected.orgas', title: 'Orgas', hint: 7 },
    { route: null, title: 'Anzeigen'}
  ]);

  this.render(hbs`{{navigation-mobile EventBus=EventBus}}`);

  assert.equal(5, this.$('.navigationBreadcrumb').children().length);

  assert.equal('A', this.$('.navigationBreadcrumb').children().eq(0).prop('tagName'));
  assert.equal('Dashboard', this.$('.navigationBreadcrumb').children().eq(0).text());
  assert.equal('/', this.$('.navigationBreadcrumb').children().eq(0).attr('href'));

  assert.equal('I', this.$('.navigationBreadcrumb').children().eq(1).prop('tagName'));
  assert.equal('chevron_right', this.$('.navigationBreadcrumb').children().eq(1).text());

  assert.equal('A', this.$('.navigationBreadcrumb').children().eq(2).prop('tagName'));
  assert.equal('Orgas', this.$('.navigationBreadcrumb').children().eq(2).text());
  assert.equal('/orgas', this.$('.navigationBreadcrumb').children().eq(2).attr('href'));

  assert.equal('I', this.$('.navigationBreadcrumb').children().eq(3).prop('tagName'));
  assert.equal('chevron_right', this.$('.navigationBreadcrumb').children().eq(3).text());

  assert.equal('SPAN', this.$('.navigationBreadcrumb').children().eq(4).prop('tagName'));
  assert.equal('Anzeigen', this.$('.navigationBreadcrumb').children().eq(4).text());
});


test('it toggles the menu', function(assert) {
  const navigationService = this.get('navigationService');
  this.stub(navigationService, 'getLevel1Navigation').returns([
    { route: 'protected.dashboard', title: 'Dashboard'},
    { route: 'protected.todos', title: 'Todos'},
    { route: 'protected.orgas', title: 'Orgas'},
  ]);

  this.render(hbs`{{navigation-mobile EventBus=EventBus}}`);

  assert.equal(0, this.$('#menu').children().length);

  this.$('#btn-sandwich').click();

  assert.equal(this.$('#menu').children().length, 4);

  Ember.run(() => {
    this.get('EventBus').publish('willTransition');
  });

  assert.equal(0, this.$('#menu').children().length);
});


test('it shows the right items in menu navigation', function(assert) {
  const navigationService = this.get('navigationService');
  this.stub(navigationService, 'getLevel1Navigation').returns([
    { route: 'protected.dashboard', title: 'Dashboard'},
    { route: 'protected.todos', title: 'Todos', hint: '10' },
    { route: 'protected.orgas', title: 'Orgas', hint: '3' },
    { route: 'protected.events', title: 'Events', hint: '12' },
    { route: 'protected.search', title: 'Suche'}
  ]);

  this.render(hbs`{{navigation-mobile EventBus=EventBus}}`);
  this.$('#btn-sandwich').click();

  assert.equal(6, this.$('#menu').children().length);

  const check = (index, title, url) => {
    assert.equal(this.$('#menu').children().eq(index).prop('tagName'), 'A');
    let htmlTitle = this.$('#menu').children().eq(index).text().trim();
    htmlTitle = htmlTitle.replace(/\s+/, ' ');
    assert.equal(htmlTitle, title);
    assert.equal(this.$('#menu').children().eq(index).attr('href'), url);
  };

  check(0, 'Dashboard', '/');
  check(1, 'Todos (10)', '/todos');
  check(2, 'Orgas (3)', '/orgas');
  check(3, 'Events (12)', '/events');
  check(4, 'Suche', '/search');
  check(5, 'Login', '/login');
});
