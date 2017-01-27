import Ember from 'ember';
import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';
import fixtures from 'afeefa-backend-ui/tests/helpers/fixtures';
import mirageInitializer from 'afeefa-backend-ui/initializers/ember-cli-mirage';

moduleForComponent('entry-form', 'Integration | Component | entry form', {
  integration: true,

  beforeEach () {
    this.inject.service('store');
    this.inject.service('event-bus', {as: 'EventBus'});

    mirageInitializer.initialize(this.container);
  },

  afterEach() {
    window.server.shutdown();
  }
});


test('form reflects current model data', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    this.set('model', fixtures.setupEvent(store));

    this.render(hbs`{{entry-form model=model}}`);

    assert.equal(this.$('input#title').val(), 'Event1');
    assert.equal(this.$('input#city').val(), 'Location1');
    assert.equal(this.$('input#contactPerson').val(), 'Contactinfo1');
    assert.equal(this.$('.annotationArea p').contents().eq(1).text().trim(),'Annotation1');

    // modify title
    this.set('model.entryInstance.title', 'new title');
    assert.equal(this.$('input#title').val(), 'new title');

    // add/remove annotation
    const annotation = store.peekRecord('annotation', 1);
    const annotation2 = store.peekRecord('annotation', 2);
    this.get('model.entryInstance.annotations').addObject(annotation2);
    Ember.run.next(this, function() {
      assert.equal(this.$('.annotationArea p').eq(0).contents().eq(1).text().trim(),'Annotation1', 'tag for annotation1');
      assert.equal(this.$('.annotationArea p').eq(1).contents().eq(1).text().trim(),'Annotation2', 'tag for annotation2');

      // remove annotation after verification and verify again in next frame
      this.get('model.entryInstance.annotations').removeObject(annotation);
      Ember.run.next(this, function() {
        assert.equal(this.$('.annotationArea p').contents().eq(1).text().trim(),'Annotation2');
      });
    });
  });
});


test('save button triggers entry save method', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    const model = fixtures.setupEvent(store);
    model.entryInstance.save = this.stub().returns({
      then: () => {}
    });
    this.set('model', model);
    this.render(hbs`{{entry-form model=model}}`);
    this.$('.entryForm__actionFooter').children().eq(0).submit();
    assert.ok(model.entryInstance.save.calledOnce);
  });
});


test('save adds relationships to entry', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    const model = fixtures.setupNewEvent(store);
    model.entryInstance.save = () => ({
      then: () => {}
    });
    this.set('model', model);
    this.render(hbs`{{entry-form model=model}}`);

    assert.equal(model.entryInstance.get('contactInfos.length'), 0);
    assert.equal(model.entryInstance.get('locations.length'), 0);

    this.$('.entryForm__actionFooter').children().eq(0).submit();

    assert.equal(model.entryInstance.get('contactInfos.length'), 1);
    assert.equal(model.entryInstance.get('locations.length'), 1);
  });
});


test('save shows notification and redirects to detail view', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    const model = fixtures.setupEvent(store);
    model.entryInstance.save = this.stub().returns({
      then: (success) => {
        success();
      }
    });
    this.set('model', model);

    const publishSpy = this.spy();
    this.get('EventBus').publish = publishSpy;

    const transitionSpy = this.spy();
    const routerMock = { transitionTo: transitionSpy };
    this.set('router', routerMock);

    this.render(hbs`{{entry-form model=model EventBus=EventBus router=router}}`);

    this.$('.entryForm__actionFooter').children().eq(0).submit();

    assert.ok(publishSpy.calledOnce);
    assert.equal(publishSpy.args[0][0], 'showAlert');
    assert.equal(publishSpy.args[0][1].title, 'Erfolgreich gespeichert');

    assert.ok(transitionSpy.calledWith('protected.event', '1'));
  });
});


test('save error raises alert', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    const model = fixtures.setupEvent(store);
    model.entryInstance.save = this.stub().returns({
      then: (success, error) => {
        error('errorMessage');
      }
    });
    this.set('model', model);
    const publishSpy = this.spy();
    this.get('EventBus').publish = publishSpy;

    this.render(hbs`{{entry-form model=model EventBus=EventBus}}`);

    this.$('.entryForm__actionFooter').children().eq(0).submit();

    assert.ok(publishSpy.calledOnce);
    assert.equal(publishSpy.args[0][0], 'showAlert');
    assert.equal(publishSpy.args[0][1].title, 'Fehler beim Speichern');
  });
});


test('save sets model in dirty state', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    const model = fixtures.setupEvent(store);
    model.entryInstance.save = () => ({
      then: () => {}
    });
    this.set('model', model);

    this.render(hbs`{{entry-form model=model EventBus=EventBus}}`);

    this.$('.entryForm__actionFooter').children().eq(0).submit();

    assert.equal(model.entryInstance.get('hasDirtyAttributes'), true);
    assert.equal(model.entryInstance.get('dirtyType'), 'updated');
    assert.equal(model.entryInstance.currentState.stateName, 'root.loaded.updated.uncommitted');
  });
});


test('model again in saved state after save()', function(assert) {
  Ember.run(() => {
    const store = this.get('store');
    const model = fixtures.setupEvent(store);
    this.set('model', model);

    // hook in transitionTo to verify model state after save
    this.set('router', {
      transitionTo: () => {
        assert.equal(model.entryInstance.get('hasDirtyAttributes'), false);
        assert.equal(model.entryInstance.currentState.stateName, 'root.loaded.saved');
      }
    });

    this.render(hbs`{{entry-form model=model EventBus=EventBus router=router}}`);

    this.$('.entryForm__actionFooter').children().eq(0).submit();

    assert.equal(model.entryInstance.get('hasDirtyAttributes'), true);
    assert.equal(model.entryInstance.get('dirtyType'), 'updated');
    assert.equal(model.entryInstance.currentState.stateName, 'root.loaded.updated.inFlight');
  });
});
