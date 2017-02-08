import Ember from 'ember';

export default Ember.Component.extend({
  isError: true,
  title: '',
  description: '',
  visible: false,
  keyDownHandler: null, // will be set runtime
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
    if (autoHide) {
      Ember.run.later((() => {
        if (this.get('visible')) {
          this.send('closeAlert');
        }
      }), autoHide);
    }

    // in order to close on ESC we now want to listen to any
    // keydown event dispatched on the body. we need to create a
    // runtime closure here to be able to refer to our component's
    // send method since jquery calls the handler using the event
    // target as the "this" :-( ... however, it works
    const alert = this;
    const handler = (event) => {
      if (event.keyCode === 27) {
        alert.send('closeAlert');
      }
    };
    this.set('keyDownHandler', handler); // save handler to revoke listener on close
    $('body').keydown(handler);
  },
  /*output icon-string for alert icon*/
  alertTypeIcon: Ember.computed('isError', function() {
    if(this.get('isError')) return 'error_outline';
    else return 'check';
  }),
  actions: {
    closeAlert: function() {
      this.set('visible', false);
      $('body').unbind('keydown', this.get('keyDownHandler'));
    }
  }
});
