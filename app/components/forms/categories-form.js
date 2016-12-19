import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  possibleCategories: null,
  didReceiveAttrs() {
    this._super(...arguments);
    /*set up possible categories*/
    let showSubCategory = this.get('showSubCategory');
    let possibleCategories = this.get('store').peekAll('category');
    possibleCategories = possibleCategories.filter((cat) => {
      return cat.get('isSubCategory') == showSubCategory;
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
