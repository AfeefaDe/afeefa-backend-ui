import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    /**
     * navigate to detail page of model instance
     * @param  {[EmberDS Instance]} instance
     */
    navigateToSingle: function(instance) {
      let id = instance.id;
      //determine the instance type (currently supported: orga, event)
      let type = instance.constructor.modelName;
      this.get('router').transitionTo('protected.'+type, id);
    }
  }
});
