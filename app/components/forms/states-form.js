import Ember from 'ember';

export default Ember.Component.extend({
  instance: null,
  selectedState: null,
  csClass: null,
  instanceBool: false,

  didReceiveAttrs() {
    if(this.get('selectedState')==='active') {
      this.set('instanceBool', true);
    }
    else {
      this.set('instanceBool', false);
    }
    this.send('setAll', this.get('instanceBool'));
  },
  valueChanged: Ember.observer('instanceBool', function() {
    //value changed
    let stateTransition = null;
    if(this.get('instanceBool')===true) stateTransition = 'activate';
    if(this.get('instanceBool')===false) stateTransition = 'deactivate';
    this.set('instance', stateTransition);
    //if set call onChange
    if(this.get('onChange')) this.get('onChange')(stateTransition);
  }),
  actions: {
    setAll(isActivated) {
      if(isActivated) {
        this.set('publishState', 'Deaktivieren');
        this.set('cssClass', 'stateActive');
      } else {
        this.set('publishState', 'Veröffentlichen');
        this.set('cssClass', 'stateInactive');
      }
    },
    togglePublishState() {
      this.toggleProperty('instanceBool');
      this.send('setAll', this.get('instanceBool'));
    }
  }
});
