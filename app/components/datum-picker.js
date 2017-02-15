import Flatpickr from 'afeefa-backend-ui/components/ember-flatpickr';

export default Flatpickr.extend({
  didRender () {
    this._super(...arguments);
    const pickerRef = this.get('flatpickrRef');
    if (pickerRef) {
      const $calendarContainer = $(pickerRef.calendarContainer);
      if ($calendarContainer.find('button').length === 0) {
        const todayButton = $('<button class="btn"><i class="material-icons">event</i>Heute</button>');
        todayButton.on('click', () => {

          const id = pickerRef.element.id;
          const path = 'model.entryInstance.' + id;
          const date = this.get(path);

          const newDate = new Date();
          date.setDate(newDate.getDate());
          date.setMonth(newDate.getMonth());
          date.setFullYear(newDate.getFullYear());
          pickerRef.setDate(newDate);

        });
        $calendarContainer.append(todayButton);
      }
    }
  }
});
