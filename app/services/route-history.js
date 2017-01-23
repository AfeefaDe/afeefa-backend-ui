import Ember from 'ember';

export default Ember.Service.extend({
  history: Ember.A(),

  getHistoryApi() {
    return window.history;
  },

  getRouteInfoFromHandler(handler) {
    const info = {
      name: handler.name,
      params: []
    };
    for (let paramKey of handler._names) {
      info.params.push(handler.params[paramKey]);
    }
    return info;
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
