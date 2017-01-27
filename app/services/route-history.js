import Ember from 'ember';

export default Ember.Service.extend({
  history: Ember.A(),
  EventBus: Ember.inject.service('event-bus'),

  init() {
    this.get('EventBus').subscribe('didTransition', this, 'onRouteChanged');
  },

  onRouteChanged() {
    const routes = this.get("router.router.state.handlerInfos");
    const handler = routes[routes.length - 1];
    const routeInfo = { name: handler.name, params: [] };
    for (let paramKey of handler._names) {
      routeInfo.params.push(handler.params[paramKey]);
    }
    this.setCurrentRoute(routeInfo);
  },

  getHistoryApi() {
    return window.history;
  },

  setCurrentRoute (routeInfo) {
    const maxHistoryLength = 10;
    const history = this.get('history');
    history.pushObject(routeInfo);
    if (history.get('length') > maxHistoryLength) {
      history.shiftObject();
    }
  },

  goBack () {
    const history = this.get('history');
    const historyLength = history.get('length');
    let last;
    if (historyLength > 1) {
      history.popObject();
      last = history.popObject();
    } else {
      history.clear();
    }

    if (last) {
      this.get('router').transitionTo(last.name, ...last.params);
    } else {
      this.getHistoryApi().back();
    }
  }

});
