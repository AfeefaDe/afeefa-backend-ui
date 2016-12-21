import Ember from 'ember';

export default Ember.Component.extend({
  instance: null,
  /*default attributes shown*/
  attributes: ['category'],
  actions: {
    /**
     * navigate to detail page of model instance
     * @param  {[EmberDS Instance]} instance
     */
    navigateToSingle: function(instance) {
      let id = instance.get('id');
      let type = instance.get('modelName');
      if(id && type) this.get('router').transitionTo('protected.'+type, id);
      else throw 'Invalid transistion type or id - Cancel transition';
    }
  },
  attributesFormatted: Ember.computed('attributes', function() {
    let attributesFormatted = [];
    if(this.get('attributes')) {
      let model = this.get('instance');
      for(let attribute of this.get('attributes')) {
        let value = this.get('instance.'+attribute);
        let name = attribute;
        /*cant use Model.transformedAttributes so I'm using this hack:*/
        let shouldFormatAsDate = (value && (typeof value.getMonth === 'function'));
        attributesFormatted.push({value: value, name: name, shouldFormatAsDate: shouldFormatAsDate});
      }
    }
    return attributesFormatted;
  }),
  stateCSSClass: Ember.computed('instance', function() {
    if(this.get('instance.active')==true) return 'entry-icon--active';
    else return 'entry-icon--inactive';
  })
});
