import Ember from 'ember';

export default Ember.Component.extend({
  instance: null,
  instanceBool: false,
  didReceiveAttrs() {
    //set init state
    if(this.get('instanceBool')===true) this.set('instance', 'activate');
    if(this.get('instanceBool')===false) this.set('instance', 'deactivate');
  },
  valueChanged: Ember.observer('instanceBool', function() {
    //value changed
    if(this.get('instanceBool')===true) this.set('instance', 'activate');
    if(this.get('instanceBool')===false) this.set('instance', 'deactivate');
  })
});
