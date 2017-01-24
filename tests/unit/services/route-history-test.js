import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import sinon from 'sinon';
import { MockGet } from 'afeefa-backend-ui/tests/helpers/mocks';

const routeMap = {};
const createRoute = (name, param) => {
  routeMap[name] = { name, params: [param] };
};
createRoute('dashboard');
createRoute('list');
createRoute('detail', 123);
createRoute('edit', 123);


moduleFor('service:route-history', 'Unit | Service | route history', {
  needs: ['service:event-bus'],

  beforeEach: function () {
    const service = this.subject();

    // reset history
    service.get('history').clear();

    // create some mocks to be later inspected
    const sandbox = sinon.sandbox.create();
    this.transitionSpy = sandbox.spy();
    this.backSpy = sandbox.spy();
    this.historyStub = sandbox.stub(service, 'getHistoryApi').returns({ back: this.backSpy });
    const routerMock = { transitionTo: this.transitionSpy };
    service.set('router', routerMock);
  }

});


test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});


test('history updates on eventbus.didchange event', function(assert) {
  const service = this.subject();
  service.setCurrentRoute = this.spy();

  const mockGet = new MockGet(service);
  mockGet.mock('router.router.state.handlerInfos', [{
    name: 'myroute', _names: [], params: {}
  }])
  service.get('EventBus').publish('didTransition');
  assert.ok(service.setCurrentRoute.calledOnce, 'setCurrentRoute called');
  assert.ok(service.setCurrentRoute.calledWith({ name: 'myroute', params: [] }), 'setCurrentRoute called with myroute');
  service.setCurrentRoute.reset();

  // again with params
  mockGet.mock('router.router.state.handlerInfos', [{
    name: 'anotherroute', _names: ['item_id'], params: {item_id: 345}
  }])
  service.get('EventBus').publish('didTransition');
  assert.ok(service.setCurrentRoute.calledOnce, 'setCurrentRoute called');
  assert.ok(service.setCurrentRoute.calledWith({ name: 'anotherroute', params: [345] }), 'setCurrentRoute called with anotherroute');
  service.setCurrentRoute.reset();

  // again with multiple routes
  mockGet.mock('router.router.state.handlerInfos', [
    { name: 'parentroute', _names: [], params: {} },
    { name: 'subroute', _names: ['item_id', 'view_id'], params: {view_id: 234, item_id: 345} }
  ])
  service.get('EventBus').publish('didTransition');
  assert.ok(service.setCurrentRoute.calledOnce, 'setCurrentRoute called');
  assert.ok(service.setCurrentRoute.calledWith({ name: 'subroute', params: [345, 234] }), 'setCurrentRoute called with subroute');
});


test('goBack sets second to last route', function(assert) {
  const service = this.subject();

  service.setCurrentRoute(routeMap['dashboard']);
  service.setCurrentRoute(routeMap['list']);
  service.setCurrentRoute(routeMap['edit']);
  service.setCurrentRoute(routeMap['detail']);
  service.setCurrentRoute(routeMap['list']);

  service.goBack();
  assert.strictEqual(routeMap['edit'], service.get('history.lastObject'));
  assert.ok(this.transitionSpy.calledOnce, 'transitionTo called');
  assert.ok(this.transitionSpy.calledWith('detail', 123), 'transitionTo called with edit,123');
  assert.ok(this.historyStub.notCalled, 'history.back not called');
  this.transitionSpy.reset();

  service.goBack();
  assert.strictEqual(routeMap['dashboard'], service.get('history.lastObject'));
  assert.ok(this.transitionSpy.calledOnce, 'transitionTo called once');
  assert.ok(this.transitionSpy.calledWith('list'), 'transitionTo called with list');
  assert.ok(this.historyStub.notCalled, 'history.back not called');
  this.transitionSpy.reset();
});


test('goBack uses browser back if less than two items in list', function(assert) {
  const service = this.subject();

  service.setCurrentRoute(routeMap['dashboard']);

  service.goBack();
  assert.strictEqual(undefined, service.get('history.lastObject'));
  assert.ok(this.transitionSpy.notCalled, 'transitionTo not called');
  assert.ok(this.backSpy.calledOnce, 'history.back called once');
});


test('history cannot grow than 10', function(assert) {
  let service = this.subject();

  service.setCurrentRoute(routeMap['edit']);
  service.setCurrentRoute(routeMap['detail']);
  for (let i = 3; i <= 10; i++) {
    service.setCurrentRoute(routeMap['dashboard']);
  }

  assert.equal(10, service.get('history.length'));
  assert.strictEqual(routeMap['edit'], service.get('history.firstObject'));
  assert.strictEqual(routeMap['dashboard'], service.get('history.lastObject'));

  service.setCurrentRoute(routeMap['list']);
  assert.equal(10, service.get('history.length'));
  assert.strictEqual(routeMap['detail'], service.get('history.firstObject'));
  assert.strictEqual(routeMap['list'], service.get('history.lastObject'));

  for (let i = 1; i <= 10; i++) {
    service.setCurrentRoute(routeMap['edit']);
  }
  assert.equal(10, service.get('history.length'));
  assert.strictEqual(routeMap['edit'], service.get('history.firstObject'));
  assert.strictEqual(routeMap['edit'], service.get('history.lastObject'));
});
