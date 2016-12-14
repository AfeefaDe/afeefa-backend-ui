import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  possibleAnnotation: null,
  didReceiveAttrs() {
    this._super(...arguments);
    const possibleAnnotation = this.get('store').peekAll('annotation');
    this.set('possibleAnnotation', possibleAnnotation);
  },
  actions: {
    selectAnnotation: function(annotationId) {
      if(this.get('onAdd')) {
        const annotation = this.get('store').peekRecord('annotation', annotationId);
        this.get('onAdd')(annotation);
      }
    }
  }
});
