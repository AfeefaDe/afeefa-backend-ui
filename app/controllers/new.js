import Ember from 'ember';

export default Ember.Controller.extend({
  //add other types later
  isOrga: Ember.computed('type', function(){
    if(this.get('model')['type'] === 'orga') {
      return true;
    }
    else {
      return false;
    }
  })
});
