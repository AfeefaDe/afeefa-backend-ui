import Ember from 'ember';

export default Ember.Component.extend({
  possibleCategories: ['community', 'welcome_ini', 'sport'],
  instance: '',
  selectedCategory: false,
  actions: {
    selectCategory: function(categoryId) {
      let newCategory;
      if(categoryId && this.get('possibleCategories')[categoryId]) newCategory = this.get('possibleCategories')[categoryId];
      else newCategory = null;
      this.set('instance', newCategory);
      //when provided we call the onChange function in the parent
      if(this.get('onChange')) this.get('onChange')(newCategory);
    }
  }
});
