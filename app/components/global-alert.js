import Ember from 'ember';

export default Ember.Component.extend({
  isError: true,
  title: '',
  description: '',
  visible: false,
  didReceiveAttrs() {
    this.EventBus.subscribe('showAlert', this, 'showAlertLocal');
  },
  willDestroyElement() {
    this.EventBus.unsubscribe('showAlert');
  },
  showAlertLocal: function({title, description, isError, autoHide}={}) {
    this.set('visible', true);
    this.set('description', description);
    this.set('title', title);
    this.set('isError', isError);
    /*start autohide timer*/
    if(autoHide) {
      Ember.run.later((()=> {
        this.send('closeAlert');
      }), autoHide);
    }
  },
  /*output icon-string for alert icon*/
  alertTypeIcon: Ember.computed('isError', function() {
    if(this.get('isError')) return 'error_outline';
    else return 'check';
  }),
  actions: {
    closeAlert: function() {
      this.set('visible', false);
    }
  },
});
