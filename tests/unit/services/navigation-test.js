import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { MockGet } from 'afeefa-backend-ui/tests/helpers/mocks';


let store;


const createRouteInfos = customInfos => {
  return [
    { name: 'application', _names: [], params: {} },
    { name: 'protected', _names: [], params: {} },
    ...customInfos
  ];
};


const createRouteInfo = (name, _names, params) => {
  return { name, _names, params };
};


const assertNavigation = (assert, expected, result) => {
  let i = 0;
  for (let [route, title, hint] of expected) {
    assert.equal(result[i].route, route, 'item route is correct');
    assert.equal(result[i].title, title, 'item title is correct');
    assert.equal(result[i].hint, hint, 'item hint is correct');
    i++;
  }
};


moduleFor('service:navigation', 'Unit | Service | navigation', {
  needs: [
    'service:event-bus',
    'model:orga',
    'model:event',
    'model:category',
    'model:contact-info',
    'model:annotation',
    'model:location'
  ],

  beforeEach () {
    store = Ember.getOwner(this).lookup('service:store');
  }
});


test('it exists and has defaults', function(assert) {
  let service = this.subject();
  assert.ok(service);

  assert.deepEqual(service.getPathNavigation(), []);
  assert.deepEqual(service.getLevel1Navigation(), []);
});


test('it triggers change event when route changes', function(assert) {
  let service = this.subject();
  service.trigger = this.spy();

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos([createRouteInfo('myroute', [], {})])
  );

  service.get('EventBus').publish('didTransition');
  assert.ok(service.trigger.calledOnce, 'service triggers');
  assert.ok(service.trigger.calledWith('change'), 'service triggers change');

  const level1Navigation = service.getLevel1Navigation();
  assert.equal(level1Navigation.length, 5);
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard', false],
    ['protected.todos', 'Todos', '0'],
    ['protected.orgas', 'Orgas', '0'],
    ['protected.events', 'Events', '0'],
    ['protected.search', 'Suche', false]
  ], level1Navigation);
});


test('it updates navigation on route change', function(assert) {
  let service = this.subject();

  // test orgas

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos([createRouteInfo('protected.orgas', [], {})])
  );
  service.get('EventBus').publish('didTransition');
  let pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard', false],
    [null, 'Orgas', '0']
  ], pathNavigation);

  // test dashboard

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos([createRouteInfo('protected.dashboard', [], {})])
  );
  service.get('EventBus').publish('didTransition');
  pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    [null, 'Dashboard', false]
  ], pathNavigation);

  // test event edit

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos([
      createRouteInfo('protected.events.list', [], {}),
      createRouteInfo('protected.events.edit', [], {})
    ])
  );
  service.get('EventBus').publish('didTransition');
  pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard', false],
    ['protected.events', 'Events', '0'],
    [null, 'Ändern', false]
  ], pathNavigation);
});


test('it updates hints on route change', function(assert) {
  let service = this.subject();

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos([createRouteInfo('myroute', [], {})])
  );

  service.get('EventBus').publish('didTransition');

  let level1Navigation = service.getLevel1Navigation();
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard', false],
    ['protected.todos', 'Todos', '0'],
    ['protected.orgas', 'Orgas', '0'],
    ['protected.events', 'Events', '0'],
    ['protected.search', 'Suche', false]
  ], level1Navigation);

  Ember.run(() => {
    const a = store.createRecord('annotation');
    const e = store.createRecord('event');
    e.get('annotations').pushObject(a);
    store.createRecord('event');
    store.createRecord('event');
    const o = store.createRecord('orga');
    o.get('annotations').pushObject(a);
    store.createRecord('orga');
    store.createRecord('orga');
    store.createRecord('orga');
  });

  service.get('EventBus').publish('didTransition');

  level1Navigation = service.getLevel1Navigation();
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard', false],
    ['protected.todos', 'Todos', '2'],
    ['protected.orgas', 'Orgas', '4'],
    ['protected.events', 'Events', '3'],
    ['protected.search', 'Suche', false]
  ], level1Navigation);
});
