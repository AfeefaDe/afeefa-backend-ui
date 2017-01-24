export function initialize(application) {
  // application.inject('route', 'foo', 'service:foo');
  application.inject('route', 'historyService', 'service:route-history');
}

export default {
  name: 'route-history',
  initialize
};
