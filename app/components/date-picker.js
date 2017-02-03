import Ember from 'ember';

import FormatReasonErrorMessage from 'afeefa-backend-ui/mixins/format-reason-error-message';

export default Ember.Component.extend(FormatReasonErrorMessage, {
  /* determine if the entryInstance has attribute model*/
  showDate: Ember.computed('model', function() {
    const entry = this.get('model.entryInstance');
    return entry.date_start || entry.date_start === null;
  }),
  // start date and start time variables
  showStartTime: '',
  startTimeIconState: '',
  startTimeButtonColor: '',
  // end date and end time variables
  showEndTime: '',
  endTimeIconState: '',
  endTimeButtonColor: '',
  // variables to handle same day notification
  isSameDay:'',
  sameDayLabelStyle: '',
  endDateStyle: '',
  didReceiveAttrs() {
    this._super(...arguments);
    // prevent to show date if entry has no date element (orga element)
    const showDate = this.get('showDate');
    if(showDate) {
      // if no start date is available set new start date
      if(!this.get('model.entryInstance.date_start')) {
        this.set('model.entryInstance.date_start', new Date());
        var dateStart = this.get('model.entryInstance.date_start');
        dateStart.setHours(0);
        dateStart.setMinutes(0);
        dateStart.setSeconds(0);
      }
      var dateEnd = this.get('model.entryInstance.date_end');
      if(dateEnd) {
        // check if end date and start are equal, then show same day label
        const day = dateEnd.getDate();
        const month = dateEnd.getMonth();
        const year = dateEnd.getFullYear();
        const dateStartObject = this.get('model.entryInstance.date_start');
        if(day === dateStartObject.getDate() && month === dateStartObject.getMonth() && year === dateStartObject.getFullYear()) {
          this.send('setSameDay', true);
        } else {
          this.send('setSameDay', false);
        }
      } else {
          // new end date
          this.set('model.entryInstance.date_end', new Date());
          dateEnd = this.get('model.entryInstance.date_end');
          dateEnd.setHours(0);
          dateEnd.setMinutes(0);
          dateEnd.setSeconds(0);
          this.send('setSameDay', true);
      }

      // set inital values for start time and end time attributes
      var has_time_start = this.get('model.entryInstance.has_time_start');
      if(has_time_start) {
        this.set('showStartTime', true);
        this.set('startTimeIconState', 'delete_forever');
        this.set('startTimeButtonColor', 'red');
      } else {
        this.set('showStartTime', false);
        this.set('startTimeIconState', 'alarm');
      }
      var has_time_end = this.get('model.entryInstance.has_time_end');
      if(has_time_end) {
        this.set('showEndTime', true);
        this.set('endTimeIconState', 'delete_forever');
        this.set('endTimeButtonColor', 'red');
      } else {
        this.set('showEndTime', false);
        this.set('endTimeIconState', 'alarm');
      }
    }
  },
  actions: {
    // start date and start time actions
    updateStartDate: function(newStartDate) {
      const day = newStartDate[0].getDate();
      const month = newStartDate[0].getMonth();
      const year = newStartDate[0].getFullYear();

      const startDateObject = this.get('model.entryInstance.date_start');
      startDateObject.setDate(day);
      startDateObject.setMonth(month);
      startDateObject.setFullYear(year);

      // show label for same day on end date, if start date and end date are equal
      const endDateObject = this.get('model.entryInstance.date_end');
      if (day === endDateObject.getDate() && month === endDateObject.getMonth() && year === endDateObject.getFullYear()) {
        this.send('setSameDay', true);
      }
      // if same day is shown, set end date equal to start date
      if(this.get('isSameDay')) {
        endDateObject.setDate(day);
        endDateObject.setMonth(month);
        endDateObject.setFullYear(year);
        // update focus of end date picker
        this.get('endDatePickerRef').setDate(startDateObject);
      }
    },
    updateStartTime: function(newStartTime) {
      const hours = newStartTime[0].getHours();
      const minutes = newStartTime[0].getMinutes();

      this.get('model.entryInstance.date_start').setHours(hours);
      this.get('model.entryInstance.date_start').setMinutes(minutes);
      this.set('model.entryInstance.has_time_start', true);
    },
    toggleStartTimeElement: function() {
      if(this.get('showStartTime')) {
        // hide start time and delete start time values
        this.send('resetStartTime');
      } else {
        // show start time
        this.set('startTimeIconState', 'delete_forever');
        this.set('startTimeButtonColor', 'red');
        this.set('model.entryInstance.has_time_start', true);
        // set start time to actual time
        const now = new Date();
        this.get('model.entryInstance.date_start').setHours(now.getHours());
        this.get('model.entryInstance.date_start').setMinutes(now.getMinutes() - (now.getMinutes()%5) );
        // open start time picker
        this.send('showStartTimePicker');
      }
      this.toggleProperty('showStartTime');
    },

    //end date and end time actions
    updateEndDate: function(newEndDate) {
      const day = newEndDate[0].getDate();
      const month = newEndDate[0].getMonth();
      const year = newEndDate[0].getFullYear();

      const endDateObject = this.get('model.entryInstance.date_end');
      endDateObject.setDate(day);
      endDateObject.setMonth(month);
      endDateObject.setFullYear(year);

      // show label for same day on end date, if end date and start date are equal
      const startDateObject = this.get('model.entryInstance.date_start');
      if (day === startDateObject.getDate() && month === startDateObject.getMonth() && year === startDateObject.getFullYear()) {
        this.send('setSameDay', true);
      } else {
        this.send('setSameDay', false);
      }
    },
    updateEndTime: function(newEndTime) {
      const hours = newEndTime[0].getHours();
      const minutes = newEndTime[0].getMinutes();

      this.get('model.entryInstance.date_end').setHours(hours);
      this.get('model.entryInstance.date_end').setMinutes(minutes);
      this.set('model.entryInstance.has_time_end', true);
    },
    toggleEndTimeElement: function() {
      if(this.get('showEndTime')) {
        // hide end time and delete end time values
        this.set('endTimeIconState', 'alarm');
        this.set('endTimeButtonColor', '');
        this.get('model.entryInstance.date_end').setHours(0);
        this.get('model.entryInstance.date_end').setMinutes(0);
        this.get('model.entryInstance.date_end').setSeconds(0);
        this.set('model.entryInstance.has_time_end', false);
      } else {
        // show end time
        this.set('endTimeIconState', 'delete_forever');
        this.set('endTimeButtonColor', 'red');
        this.set('model.entryInstance.has_time_end', true);
        // set end time to actual time
        const now = new Date();
        this.get('model.entryInstance.date_end').setHours(now.getHours());
        this.get('model.entryInstance.date_end').setMinutes(now.getMinutes() - (now.getMinutes()%5) );
        // open end time picker
        this.send('showEndTimePicker');
      }
      this.toggleProperty('showEndTime');
    },
    setSameDay: function(isSame) {
      if(isSame) {
        this.set('endDateStyle', 'hide-endDate');
        this.set('sameDayLabelStyle', '');
        this.set('isSameDay', true);
        // check if end time values are still valid
        this.send('testEndTimeRange');
      } else {
        this.set('endDateStyle', '');
        this.set('sameDayLabelStyle', 'hide-sameDay-label');
        this.set('isSameDay', false);
      }
    },
    showStartDatePicker: function() {
      // bugfix for: documentClick is called, when clicked
      Ember.run.later(() => {
        this.get('startDatePickerRef').toggle();
      });
    },
    showEndDatePicker: function() {
      // bugfix for: documentClick is called, when clicked
      Ember.run.later(() => {
        this.get('endDatePickerRef').toggle();
      });
    },
    showStartTimePicker: function() {
      // bugfix for: documentClick is called, when clicked
      Ember.run.later(() => {
        this.get('startTimePickerRef').open();
      });
    },
    showEndTimePicker: function() {
      // bugfix for: documentClick is called, when clicked
      Ember.run.later(() => {
        this.get('endTimePickerRef').open();
      });
    },
    setStartDateRange: function() {
      // start date <= end date
      if(!this.get('isSameDay')) {
        this.get('startDatePickerRef').set('maxDate', this.get('model.entryInstance.date_end'));
      }
      else {
        this.get('startDatePickerRef').set('maxDate', '');
      }
    },
    setEndDateRange: function() {
      // end date >= start date
      this.get('endDatePickerRef').set('minDate', this.get('model.entryInstance.date_start'));
    },
    resetStartTime: function() {
      // hide start time and delete start time values
      this.set('startTimeIconState', 'alarm');
      this.set('startTimeButtonColor', '');
      this.get('model.entryInstance.date_start').setHours(0);
      this.get('model.entryInstance.date_start').setMinutes(0);
      this.get('model.entryInstance.date_start').setSeconds(0);
      this.set('model.entryInstance.has_time_start', false);
    },
    resetEndTime: function() {
      // hide end time and delete end time values
      this.set('endTimeIconState', 'alarm');
      this.set('endTimeButtonColor', '');
      this.get('model.entryInstance.date_end').setHours(0);
      this.get('model.entryInstance.date_end').setMinutes(0);
      this.get('model.entryInstance.date_end').setSeconds(0);
      this.set('model.entryInstance.has_time_end', false);
    },
    testStartTimeRange: function() {
      if(this.get('isSameDay')) {
        const startTime = this.get('model.entryInstance.date_start').getTime();
        const endTime = this.get('model.entryInstance.date_end').getTime();
        const hasStartTime = this.get('model.entryInstance.has_time_start');
        const hasEndTime = this.get('model.entryInstance.has_time_end');

        if(startTime >= endTime && hasStartTime && hasEndTime) {
          let error = this.handleError();
          error.title = 'Eingabeproblem';
          error.description = 'Startzeit liegt hinter oder gleicht der Endzeit';
          this.EventBus.publish('showAlert', error);

          this.send('resetStartTime');
          this.toggleProperty('showStartTime');
        }
      }
    },
    testEndTimeRange: function() {
      if(this.get('isSameDay')) {
        const startTime = this.get('model.entryInstance.date_start').getTime();
        const endTime = this.get('model.entryInstance.date_end').getTime();
        const hasStartTime = this.get('model.entryInstance.has_time_start');
        const hasEndTime = this.get('model.entryInstance.has_time_end');

        if(endTime <= startTime && hasStartTime && hasEndTime) {
          let error = this.handleError();
          error.title = 'Eingabeproblem';
          error.description = 'Endzeit liegt vor oder gleicht der Startzeit';
          this.EventBus.publish('showAlert', error);

          this.send('resetEndTime');
          this.toggleProperty('showEndTime');
        }
      }
    }
  },
});
