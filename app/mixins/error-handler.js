import Ember from 'ember';

/*
 * Mixin that outputs API errors to UI Toast's
 */
export default Ember.Mixin.create({
  handleError: function(reason) {
    if(reason.errors) {
      for (var singleError of reason.errors) {
        const singleErrorString = `Error saving orga (HTTP: ${singleError.status}): \n${singleError.detail}`;
        alert(singleErrorString);
      }
    }
  }
});
