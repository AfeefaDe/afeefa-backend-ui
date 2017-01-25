import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const alertData = {title: 'Erfolgreich gespeichert' , description: 'Dein Eintrag wurde erfolgreich angelegt.', isError: true, autoHide: true};

moduleForComponent('global-alert', 'Integration | Component | global alert', {
  integration: true,
   beforeEach: function () {
    this.inject.service('event-bus', {as: 'EventBus'});
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{afeefa-navigation EventBus=EventBus}}`);
  assert.equal(this.$().text().trim(), 'menu');
});

test('it shows the alert data on showAlert action', function(assert) {
  this.render(hbs`{{global-alert EventBus=EventBus}}`);
  const {title, description, isError} = alertData;
  /* show alert*/
  Ember.run(() => {
    this.get('EventBus').publish('showAlert', alertData);
  });
  /*assertions*/
  assert.equal(this.$('.alert__contentTitle').text().trim(), title);
  assert.equal(this.$('.alert__contentDescription').text().trim(), description);
  let iconText = (isError ? 'error_outline' : 'check');
  assert.equal(this.$('.alert__stateIcon').text().trim(), iconText);
  assert.equal(this.$('.alert').hasClass('alert--visible'), true);
});

test('it hides on click', function(assert) {
  this.render(hbs`{{global-alert EventBus=EventBus}}`);
  Ember.run(() => {
    this.get('EventBus').publish('showAlert', alertData);
  });
  assert.equal(this.$('.alert').hasClass('alert--visible'), true);
  this.$('.alert').click();
  assert.equal(this.$('.alert').hasClass('alert--invisible'), true);
});

test('it hides using the autoHide option', function(assert) {
  this.render(hbs`{{global-alert EventBus=EventBus}}`);
  let customAlertData = alertData;
  let interval = 10;
  customAlertData.autoHide = interval;

  Ember.run(() => {
    this.get('EventBus').publish('showAlert', alertData);
  });
  assert.equal(this.$('.alert').hasClass('alert--visible'), true);
  var autohideDone = assert.async();
  setTimeout(function() {
    assert.equal(this.$('.alert').hasClass('alert--invisible'), true);
    autohideDone();
  }, interval);
});
