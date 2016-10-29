import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    saveOrga: function() {
      this.get('orga').save();
    },
    setCategory: function(newCategoryId) {
      let newCategory;
      if(newCategoryId === -1) newCategory = "";
      else newCategory = this.get('categories')[newCategoryId];
      console.log("Save new CategoryId: ", newCategoryId);
      this.get('orga').set('category', newCategory);
    }
  },
  categories: ['community', 'welcome_ini', 'sport']
});
