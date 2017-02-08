import Ember from 'ember';

export default Ember.Component.extend({
  showSubCategoryForm: Ember.computed('parentInstance', function() {
    //when parentInstance changes, clear child
    this.set('childInstance', null);
    if(!this.get('parentInstance.id')){
      return false;
    }
    else return true;
  })
});
