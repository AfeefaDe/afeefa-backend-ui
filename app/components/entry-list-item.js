import Ember from 'ember';

export default Ember.Component.extend({
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
  }
});
