import Ember from 'ember';
import RouteHistoryInitializer from 'afeefa-backend-ui/initializers/route-history';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | route history', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RouteHistoryInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
