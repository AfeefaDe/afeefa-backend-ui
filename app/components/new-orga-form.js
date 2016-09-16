import Ember from 'ember';
/*
 * mixins with function validateForm
 */
import formValidatorMixin from '../mixins/form-validator';

export default Ember.Component.extend(formValidatorMixin , {
  store: Ember.inject.service(),
	actions: {
		save: function() {
      let validated = this.validateForm(['title', 'description']);
      console.log(validated);
      if(validated) {
        var orga = this.get('store').createRecord('orga', {
          title: this.get('title'),
          description: this.get('description')
        });
        orga.save();
      }
		}
	}
});

