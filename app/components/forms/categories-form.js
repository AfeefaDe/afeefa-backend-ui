import Ember from 'ember';

export default Ember.Component.extend({
  possibleCategories: ['jobs', 'donation', 'leisure', 'language', 'community', 'general', 'medic', 'consultation'],
  instance: '',
  actions: {
    selectCategory: function(categoryId) {
      let newCategory;
      if(categoryId && this.get('possibleCategories')[categoryId]) newCategory = this.get('possibleCategories')[categoryId];
      this.set('instance', newCategory);
    }
  }
});
