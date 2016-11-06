//ref: http://stackoverflow.com/questions/30697674/ember-transitiontoroute-cleanly-in-a-component-without-sendaction
export function initialize(application) {
  // Injects all Ember components with a router object:
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'component-router-injector',
  initialize: initialize
};
