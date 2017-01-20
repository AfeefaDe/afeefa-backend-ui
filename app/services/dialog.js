import Ember from 'ember';

class DialogPromise {
  yes (callback) {
    this.yes = callback;
    return this;
  }
  no (callback) {
    this.no = callback;
    return this;
  }
  cancel (callback) {
    this.cancel = callback;
    return this;
  }
  resolve (reason) {
    if (reason === 'yes' && this.yes) {
      this.yes();
    }
    if (reason === 'no' && this.no) {
      this.no();
    }
    if (reason === 'cancel' && this.cancel) {
      this.cancel();
    }
  }
}


export default Ember.Service.extend({
  show: false,
  promise: null,

  title: null,
  message: null,
  yesButton: null,
  noButton: null,

  showDialog ({ title = 'Titel', message = 'Fortfahren?', yesButton = 'Ja', noButton = 'Nein'}) {
    this.set('show', true);
    this.set('title', title);
    this.set('message', message);
    this.set('yesButton', yesButton);
    this.set('noButton', noButton);

    const promise = new DialogPromise();
    this.set('promise', promise);
    return promise;
  },

  hideDialog (reason) {
    this.set('show', false);
    this.get('promise').resolve(reason);
  }
});
