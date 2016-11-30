import Ember from 'ember';

export default Ember.Component.extend({
  alertType: 'alert--error',
  title: '',
  description: '',
  visible: false,
  didReceiveAttrs() {
    this.EventBus.subscribe('showAlert', this, 'showAlertLocal');
  },
  willDestroyElement() {
    this.EventBus.unsubscribe('showAlert');
  },
  showAlertLocal: function(title) {
    this.set('visible', true);
    this.set('title', title);
  },
  visibleClass: Ember.computed('visible', function() {
    if(this.get('visible')) return 'alert--visible';
    else return 'alert--invisible';
  }),
  actions: {
    closeAlert: function() {
      this.set('visible', false);
    }
  }
});
