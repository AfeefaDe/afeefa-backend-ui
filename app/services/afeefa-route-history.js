import Ember from 'ember';

export default Ember.Service.extend({
  history: Ember.A(),

  setCurrentRoute (route) {
    const maxHistoryLength = 10;
    const history = this.get('history');
    history.pushObject(route);
    if (history.get('length') > maxHistoryLength) {
      history.shiftObject();
    }
  },

  goBack () {
    const history = this.get('history');
    const historyLength = history.get('length');
    let last;
    if (!Ember.isEmpty(history) && historyLength > 1) {
      last = history.objectAt(historyLength - 2);
    }

    if (last) {
      let id;
      if (last._names.length) {
        const idName = last._names[0];
        id = last.params[idName];
      }
      this.get('router').transitionTo(last.name, id);
    } else {
      window.history.back();
    }
  }

});
