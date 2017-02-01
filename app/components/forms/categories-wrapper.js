import Ember from 'ember';

export default Ember.Component.extend({
  showSubCategoryForm: Ember.computed('parentInstance', function() {
    if(!this.get('parentInstance.id')){
      return false;
    }
    else return true;
  })
});
