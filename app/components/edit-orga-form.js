import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  orga: null,
  actions: {
    saveOrga: function() {
      this.get('orga').save();
    },
    /*
     * gets called by categories-form onChange:
     */
    setCategory: function(newCategory) {
      this.get('orga').set('category', newCategory);
    }
  }
});
