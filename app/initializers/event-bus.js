import EventBus from '../services/event-bus';

export function initialize(application) {
  application.inject('component', 'EventBus', 'service:event-bus');
  application.inject('controller', 'EventBus', 'service:event-bus');
  application.inject('route', 'EventBus', 'service:event-bus');
}

export default {
  name: 'event-bus',
  initialize
};
