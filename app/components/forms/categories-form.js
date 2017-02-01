import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  didReceiveAttrs() {
    this._super(...arguments);
  },
  possibleCategories: Ember.computed('selectedParentCategory', function() {
    let selectedParentCategory = this.get('selectedParentCategory');
    let possibleCategories = this.get('store').peekAll('category');
    possibleCategories = possibleCategories.filter((cat) => {
      //false: no parentCategory selected -> show all top level categories
      if(selectedParentCategory===false) {
        return !cat.get('parentCategory.id');
      }
      else if(selectedParentCategory.get('id')) {
        return cat.get('parentCategory.id') === selectedParentCategory.get('id');
      }
    });
    return possibleCategories;
  }),
  actions: {
    selectCategory: function(categoryId) {
      let newCategory = this.get('store').peekRecord('category', categoryId);
      this.set('instance', newCategory);
    }
  }
});
