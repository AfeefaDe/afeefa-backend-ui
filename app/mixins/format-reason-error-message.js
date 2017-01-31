import Ember from 'ember';

export default Ember.Mixin.create({
  /*
   * takes the reason from an ember-data request (e.g. save) and tranforms it into a valid alert data object
   * the title and description can be specified afterwards
   * @todo: I want to call this.EventBus.publish('showAlert',...)from here. But this is undefined!
   */
  handleError(reason) {
      const alertData = {title: 'Fehler', description: 'Unbekannter Fehler', isError: true, autoHide: false};
      if(reason && reason.errors) {
        let errorDetail = '';
        for (var singleError of reason.errors) {
          errorDetail = errorDetail + ' ' + singleError.detail + '\n';
        }
        alertData.description = errorDetail;
      }
      return alertData;
  }
});
