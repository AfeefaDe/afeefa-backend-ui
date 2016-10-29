import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    selectCategory: function(categoryId) {
      if(categoryId && this.get('possibleCategories')[categoryId]) this.set('instance', this.get('possibleCategories')[categoryId]);
      else this.set('instance', '');
    }
  },
  selectedCategory: false,
  instance: '',
  possibleCategories: ['community', 'welcome_ini', 'sport'],
});
