import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  possibleCategories: null,
  didReceiveAttrs() {
    this._super(...arguments);
    /*set up possible categories*/
    let selectedParentCategory = this.get('selectedParentCategory');
    let possibleCategories = this.get('store').peekAll('category');
    possibleCategories = possibleCategories.filter((cat) => {
      if(selectedParentCategory===false) return true;
      return cat.get('parentCategory') === selectedParentCategory;
    });
    this.set('possibleCategories', possibleCategories);
  },
  actions: {
    selectCategory: function(categoryId) {
      let newCategory = this.get('store').peekRecord('category', categoryId);
      this.set('instance', newCategory);
    }
  }
});
