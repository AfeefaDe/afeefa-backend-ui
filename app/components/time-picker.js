import Ember from 'ember';
import Flatpickr from 'afeefa-backend-ui/components/ember-flatpickr';

export default Flatpickr.extend({
  didRender () {
    this._super(...arguments);

    const pickerRef = this.get('flatpickrRef');
    if (pickerRef) {
      const $timeContainer = $(pickerRef.timeContainer);
      if ($timeContainer.find('button').length === 0) {
        const closeButton = $('<button class="btn"><i class="material-icons">done</i></button>');
        closeButton.on('click', () => {
          pickerRef.close();
        })
        $timeContainer.append(closeButton);
      }
    }
  }
});
