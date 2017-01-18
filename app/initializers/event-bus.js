import EventBus from '../services/event-bus';

export function initialize(application) {
    let eventBus = EventBus.create();
    application.register('event-bus:current', eventBus, {
      instantiate: false
    });
    application.inject('component', 'EventBus', 'event-bus:current');
    application.inject('controller', 'EventBus', 'event-bus:current');
    application.inject('route', 'EventBus', 'event-bus:current');
    application.inject('router:main', 'EventBus', 'event-bus:current');
}

export default {
  name: 'event-bus',
  initialize
};
