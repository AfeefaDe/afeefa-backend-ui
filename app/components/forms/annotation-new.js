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
    selectAnnotation: function(selectInput) {
      const annotationId = selectInput.value;
      if(this.get('onAdd') && annotationId >= 0) {
        const annotation = this.get('store').peekRecord('annotation', annotationId);
        this.get('onAdd')(annotation);
        //reset selectInput to show "Neue Anmerkung hinzufügen"
        selectInput.value = "-1";
      }
    }
  }
});
