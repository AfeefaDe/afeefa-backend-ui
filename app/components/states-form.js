import Ember from 'ember';

export default Ember.Component.extend({
  instance: null,
  selectedState: null,
  instanceBool: false,
  didReceiveAttrs() {
    if(this.get('selectedState')==='active') this.set('instanceBool', true);
    if(this.get('selectedState')==='inactive') this.set('instanceBool', false);
  },
  valueChanged: Ember.observer('instanceBool', function() {
    //value changed
    let stateTransition = null;
    if(this.get('instanceBool')===true) stateTransition = 'activate';
    if(this.get('instanceBool')===false) stateTransition = 'deactivate';
    this.set('instance', stateTransition);
    //if set call onChange
    if(this.get('onChange')) this.get('onChange')(stateTransition);
  })
});
