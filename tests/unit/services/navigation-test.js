import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { MockGet } from 'afeefa-backend-ui/tests/helpers/mocks';


const createRouteInfos = (name, _names, params) => {
  return [
    { name: 'application', _names: [], params: {} },
    { name: 'protected', _names: [], params: {} },
    { name, _names, params }
  ];
};

const assertNavigation = (assert, expected, result) => {
  let i = 0;
  for (let [route, title] of expected) {
    assert.equal(route, result[i].route, 'item route is correct');
    assert.equal(title, result[i].title, 'item title is correct');
    i++;
  }
};


moduleFor('service:navigation', 'Unit | Service | navigation', {
  needs: ['service:event-bus']
});


test('it exists and has defaults', function(assert) {
  let service = this.subject();
  assert.ok(service);

  assert.deepEqual([], service.getPathNavigation());

  const level1Navigation = service.getLevel1Navigation();
  assert.equal(5, level1Navigation.length);
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard'],
    ['protected.todos', 'Todos'],
    ['protected.orgas', 'Orgas'],
    ['protected.events', 'Events'],
    ['protected.search', 'Suche']
  ], level1Navigation);
});


test('it triggers change event when route changes', function(assert) {
  let service = this.subject();
  service.trigger = this.spy();

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos('myroute', [], {})
  );

  service.get('EventBus').publish('didTransition');
  assert.ok(service.trigger.calledOnce, 'service triggers');
  assert.ok(service.trigger.calledWith('change'), 'service triggers change');
});


test('it updates navigation on route change', function(assert) {
  let service = this.subject();

  // test orgas

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos('protected.orgas', [], {})
  );
  service.get('EventBus').publish('didTransition');
  let pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard'],
    [null, 'Orgas']
  ], pathNavigation);

  // test dashboard

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos('protected.dashboard', [], {})
  );
  service.get('EventBus').publish('didTransition');
  pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    [null, 'Dashboard']
  ], pathNavigation);

  // test event edit

  new MockGet(service).mock('router.router.state.handlerInfos',
    createRouteInfos('protected.editevent', [], {})
  );
  service.get('EventBus').publish('didTransition');
  pathNavigation = service.getPathNavigation();
  assertNavigation(assert, [
    ['protected.dashboard', 'Dashboard'],
    ['protected.events', 'Events'],
    [null, 'Ändern']
  ], pathNavigation);
});
