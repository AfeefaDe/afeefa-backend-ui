import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { MockGet } from 'afeefa-backend-ui/tests/helpers/mocks';


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
  for (let [route, title] of expected) {
    assert.equal(result[i].route, route, 'item route is correct');
    assert.equal(result[i].title, title, 'item title is correct');
    i++;
  }
};


moduleFor('service:navigation', 'Unit | Service | navigation', {
  needs: ['service:event-bus']
});


test('it exists and has defaults', function(assert) {
  let service = this.subject();
  assert.ok(service);

  assert.deepEqual(service.getPathNavigation(), []);

  const level1Navigation = service.getLevel1Navigation();
  assert.equal(level1Navigation.length, 5);
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard'],
    ['protected.todos', 'Todos'],
    ['protected.orgas.list', 'Orgas'],
    ['protected.events.list', 'Events'],
    ['protected.search', 'Suche']
  ], level1Navigation);
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
});


test('it updates navigation on route change', function(assert) {
  let service = this.subject();

  // test orgas

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos([createRouteInfo('protected.orgas.list', [], {})])
  );
  service.get('EventBus').publish('didTransition');
  let pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard'],
    [null, 'Orgas']
  ], pathNavigation);

  // test dashboard

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos([createRouteInfo('protected.dashboard', [], {})])
  );
  service.get('EventBus').publish('didTransition');
  pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    [null, 'Dashboard']
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
  console.log(pathNavigation);
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard'],
    ['protected.events.list', 'Events'],
    [null, 'Ändern']
  ], pathNavigation);
});
