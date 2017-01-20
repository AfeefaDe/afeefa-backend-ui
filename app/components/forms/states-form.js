import Ember from 'ember';
import FormatReasonErrorMessage from '../../mixins/format-reason-error-message';

export default Ember.Component.extend(FormatReasonErrorMessage,{
  instance: null,
  savingInstance: false,
  /*
   * CSS class to set button color - use materialize classes
   */
  cssClass: Ember.computed('instance.active', function() {
    if(this.get('instance.active')===true) return 'red';
  }),
  /*
   * Text shown inside the button
   */
  buttonLabel: Ember.computed('instance.active', function() {
    if(this.get('instance.active')===true) return 'Deaktivieren';
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
        const newState = !instance.get('active');
        instance.set('active', newState);
        instance.save().then(()=> {
          this.set('savingInstance', false);
        }, (reason)=> {
          let error = this.handleError(reason);
          error.title = 'Fehler beim Veröffentlichen';
          this.EventBus.publish('showAlert', error);
          instance.rollbackAttributes();
          this.set('savingInstance', false);
        });
      }
    }
  }
});
