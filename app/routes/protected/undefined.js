import Ember from 'ember';

export default Ember.Route.extend({
  /*
   * this route is called for every undefined path: show an error alert and transition to dashboard
   */
  beforeModel(transition) {
    let message = 'Die angeforderte Seite wurde nicht gefunden. Du wurdest auf das Dashboard umgeleitet.';
    if(transition.intent.url) message = `${transition.intent.url} wurde nicht gefunden. Du wurdest auf das Dashboard umgeleitet.`;
    const alertData = {title: '404 - Seite nicht gefunden', description: message, isError: true, autoHide: false};
    this.EventBus.publish('showAlert', alertData);
    this.transitionTo('protected.dashboard');
  }
});
