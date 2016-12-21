import Ember from 'ember';

export default Ember.Component.extend({
  instance: null,
  savingInstance: false,
  /*
   * CSS class to set button color - use materialize classes
   */
  cssClass: Ember.computed('instance.state', function() {
    if(this.get('instance.state')==true) return 'red';
  }),
  /*
   * Text shown inside the button
   */
  buttonLabel: Ember.computed('instance.state', function() {
    if(this.get('instance.state')==true) return 'Deaktivieren';
    else return 'Aktivieren';
  }),
  actions: {
    /*
     * Action triggered by the button
     */
    togglePublishState() {
      if(!this.get('savingInstance')) {
        this.set('savingInstance', true);
        let instance = this.get('instance');
        const newState = !instance.get('state');
        instance.set('state', newState);
        instance.save().then(()=> {
          this.set('savingInstance', false);
        }, (reason)=> {
          instance.rollbackAttributes();
          this.set('savingInstance', false);
        });
      }
    }
  }
});
