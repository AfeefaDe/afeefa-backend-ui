import Ember from 'ember';

export default Ember.Component.extend({
  possibleStates: ['active', 'inactive'],
  instance: 'active',
  selectedState: 'active',
  actions: {
    selectState: function(stateId) {
      let newState;
      if(stateId && this.get('possibleStates')[stateId]) newState = this.get('possibleStates')[stateId];
      else newState = 'active';
      this.set('instance', newState);
      //when provided we call the onChange function in the parent
      if(this.get('onChange')) this.get('onChange')(newState);
    }
  }
});
