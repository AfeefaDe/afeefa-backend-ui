import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';

//Stub location service
const dialogServiceMock = Ember.Service.extend({
  hideDialog(reason) {

  }
});

moduleForComponent('afeefa-dialog', 'Integration | Component | afeefa dialog', {
  // needs: ['service:dialog'],
  integration: true,

  beforeEach: function () {
      // this.register('service:dialog', userSession);
      this.inject.service('dialog',  {as: 'dialogService'});
  }
});


test('it renders', function(assert) {
  this.render(hbs`{{afeefa-dialog}}`);
  assert.equal(this.$().text().trim(), 'close');
});


test('it shows the given text attributes', function(assert) {
  Ember.run(() => {
    this.dialogService.showDialog({
      title: 'Fancy Title',
      message: 'Das ist eine krasse Sache!',
      yesButton: 'Yoman',
      noButton: 'Nope'
    });
  });
  this.render(hbs`{{afeefa-dialog}}`);

  assert.equal(this.$('.dialog__closeIcon i').text(), 'close');
  assert.equal(this.$('.dialog__contentTitle').text(), 'Fancy Title');
  assert.equal(this.$('.dialog__contentMessage').text(), 'Das ist eine krasse Sache!');
  assert.equal(this.$('.dialog__action.dialog__action--yes').text(), 'Yoman');
  assert.equal(this.$('.dialog__action.dialog__action--no').text(), 'Nope');
});


test('it triggers the appropriate service actions on button click', function(assert) {
  const yes = this.spy();
  const no = this.spy();
  const cancel = this.spy();

  this.render(hbs`{{afeefa-dialog}}`);

  Ember.run(() => {
    const promise = this.dialogService.showDialog({});
    promise.yes(yes);
    promise.no(no);
    promise.cancel(cancel);
  });

  // click yes
  this.$('.dialog__action.dialog__action--yes').click();
  assert.ok(yes.calledOnce, 'yes called');
  assert.ok(no.notCalled, 'no not called');
  assert.ok(cancel.notCalled, 'cancel not called');
  yes.reset();

  // click no
  this.$('.dialog__action.dialog__action--no').click();
  assert.ok(yes.notCalled, 'yes not called');
  assert.ok(no.calledOnce, 'no called');
  assert.ok(cancel.notCalled, 'cancel not called');
  no.reset();

  // click cancel
  this.$('.dialog__closeIcon').click();
  assert.ok(yes.notCalled, 'yes not called');
  assert.ok(no.notCalled, 'no not called');
  assert.ok(cancel.calledOnce, 'cancel called');
  cancel.reset();
});

test('it triggers the appropriate service actions on button click', function(assert) {
  const cancel = this.spy();

  this.render(hbs`{{afeefa-dialog}}`);

  Ember.run(() => {
    const promise = this.dialogService.showDialog({});
    promise.cancel(cancel);
  });

  // initial focus
  assert.equal(document.activeElement, this.$('> div').get(0));

  // hit esc
  var e = $.Event('keydown');
  e.keyCode = 27;
  this.$('> div').trigger(e);
  assert.ok(cancel.calledOnce, 'cancel called after escape');

  // focus removed
  assert.equal($('body').get(0), document.activeElement);
});
