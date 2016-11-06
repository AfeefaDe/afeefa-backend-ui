import Ember from 'ember';

Ember.Application.initializer({
  name: 'load-services',
  initialize: function(container, application) {
    var eventBus = App.EventBus.create();

    application.register('event-bus:current', eventBus, {
      instantiate: false
    });

    application.inject('component', 'EventBus', 'event-bus:current');
    application.inject('controller', 'EventBus', 'event-bus:current');
  }
});
