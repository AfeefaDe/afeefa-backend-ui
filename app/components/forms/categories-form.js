import Ember from 'ember';

export default Ember.Component.extend({
  possibleCategories: ['jobs', 'donation', 'leisure', 'language', 'community', 'general', 'medic', 'consultation'],
  didReceiveAttrs() {
    this._super(...arguments);
    /*set default category; should be selected in hbs too!*/
    if(!this.get('instance')) this.send('selectCategory', 0);
  },
  actions: {
    selectCategory: function(categoryId) {
      let newCategory;
      if(this.get('possibleCategories')[categoryId]) newCategory = this.get('possibleCategories')[categoryId];
      this.set('instance', newCategory);
    }
  }
});
