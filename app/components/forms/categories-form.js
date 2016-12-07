import Ember from 'ember';

export default Ember.Component.extend({
  possibleCategories: ['jobs', 'donation', 'leisure', 'language', 'community', 'general', 'medic', 'consultation'],
  actions: {
    selectCategory: function(categoryId) {
      let newCategory;
      if(this.get('possibleCategories')[categoryId]) newCategory = this.get('possibleCategories')[categoryId];
      this.set('instance', newCategory);
    }
  }
});
