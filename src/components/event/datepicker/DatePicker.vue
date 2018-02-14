<template>
  <div class="datePicker">

    <!-- start date and start time  -->
    <div class="rowDateAndTime">
      <button @click.prevent.stop="toggleStartDatePicker" class="showDateButton btn waves-effect waves-light">
        <i class="material-icons center">event</i>
      </button>

      <div @click.prevent.stop="toggleStartDatePicker" class="dateField start-dateField inputField__spacing input-field">
        <label for="startDate" :class="['clickableElement', {active: currentDateStart}]">{{ $t("entries.date_start") }} <span class="mandatoryField">({{ $t('infos.mandatory_field') }})</span></label>
        <day-picker ref="startDatePickerRef" id="startDate" :options="dateOptions"/>
      </div>

      <template v-if="hasStartTime">
        <button @click.prevent.stop="toggleStartTimeButton" class="red showTimeButton btn waves-effect waves-light">
          <i class="material-icons center">delete_forever</i>
        </button>
        <div @click.prevent.stop="toggleStartTimePicker" class="dateField start-time-field inputField__spacing input-field">
          <label for="startTime" :class="['clickableElement', {active: currentTimeStart}]">{{ $t("entries.time_start") }}</label>
          <time-picker id="startTime" :options="timeOptions" @FlatpickrRef="setStartTimeRef"/>
        </div>
      </template>
      <template v-else>
        <button @click.prevent.stop="toggleStartTimeButton" class="showTimeButton btn waves-effect waves-light">
          <i class="material-icons center">alarm</i>
        </button>
      </template>
    </div>

    <!-- end Date and end time  -->
    <div class="rowDateAndTime">
      <button @click.prevent.stop="toggleEndDatePicker" class="showDateButton btn waves-effect waves-light">
        <i class="material-icons center">event</i>
      </button>

      <div @click.prevent.stop="toggleEndDatePicker" class="dateField end-dateField inputField__spacing input-field">
        <label for="endDate" :class="['clickableElement', {active: currentDateEnd}]">{{ $t("entries.date_end") }}</label>
        <span :class="['clickableElement', 'isSameDayLabel', {'hideSpan': !isSameDay}]"> Gleicher Tag </span>
        <day-picker :class="{'hidePicker': isSameDay}" ref="endDatePickerRef" id="endDate" :options="dateOptions"/>
      </div>

      <template v-if="hasEndTime">
        <button @click.prevent.stop="toggleEndTimeButton" class="red showTimeButton btn waves-effect waves-light">
          <i class="material-icons center">delete_forever</i>
        </button>

        <div @click.prevent.stop="toggleEndTimePicker" class="dateField end-time-field inputField__spacing input-field">
          <label for="endTime" :class="['clickableElement', {active: currentTimeEnd}]">{{ $t("entries.time_end") }}</label>
          <time-picker id="endTime" :options="timeOptions" @FlatpickrRef="setEndTimeRef"/>
        </div>
      </template>
      <template v-else>
        <button @click.prevent.stop="toggleEndTimeButton" class="showTimeButton btn waves-effect waves-light">
          <i class="material-icons center">alarm</i>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import TimePicker from './TimePicker'
import DayPicker from './DayPicker'
import moment from 'moment'

export default {
  props: ['dateStart', 'dateEnd', 'hasTimeStart', 'hasTimeEnd'],

  data () {
    return {
      currentDateStart: null,
      currentDateEnd: null,
      hasStartTime: null,
      hasEndTime: null,
      isSameDay: null,

      dateOptions: {
        clickOpens: false,
        enableTime: false,
        dateFormat: 'd.m.Y',
        onClose: this.pickerClosed
      },

      timeOptions: {
        clickOpens: false,
        noCalendar: true,
        enableTime: true,
        minuteIncrement: 5,
        time_24hr: true,
        dateFormat: 'H:i',
        onClose: this.pickerClosed
      },

      startDateRef: null,
      endDateRef: null,
      startTimeRef: null,
      endTimeRef: null
    }
  },

  created () {
    this.currentDateStart = this.dateStart ? new Date(this.dateStart) : new Date()
    this.currentTimeStart = this.dateStart ? new Date(this.dateStart) : new Date()
    this.currentDateEnd = this.dateEnd ? new Date(this.dateEnd) : new Date()
    this.currentTimeEnd = this.dateEnd ? new Date(this.dateEnd) : new Date()
    this.hasStartTime = this.hasTimeStart
    this.hasEndTime = this.hasTimeEnd
    this.checkSameDay()

    // set new start date if not existing
    if (this.dateStart === null) {
      this.$emit('input', {dateStart: this.currentDateStart, dateEnd: this.dateEnd, hasTimeStart: this.hasTimeStart, hasTimeEnd: this.hasTimeEnd})
    }
  },

  mounted () {
    /*
     * Fix Materialize always setting our Label to active,
     * even if picker has been closed via ESC.
     * Override event listener from:
     * https://github.com/Dogfalo/materialize/blob/master/js/forms.js#L23
     */
    const inputs = this.$el.querySelectorAll('input')
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        event.stopPropagation()
      })
    })

    this.startDateRef = this.$refs.startDatePickerRef.fp
    const startDay = moment(this.currentDateStart).startOf('day').toDate()
    this.startDateRef.setDate(startDay)

    this.endDateRef = this.$refs.endDatePickerRef.fp
    const endDay = moment(this.currentDateEnd).startOf('day').toDate()
    this.endDateRef.setDate(endDay)
  },

  methods: {
    setStartTimeRef (fp) {
      this.startTimeRef = fp
      const startTimeDate = this.roundMinutes(moment(this.currentTimeStart)).toDate()
      this.startTimeRef.setDate(startTimeDate)
    },

    setEndTimeRef (fp) {
      this.endTimeRef = fp
      const endTimeDate = this.roundMinutes(moment(this.currentTimeEnd)).toDate()
      this.endTimeRef.setDate(endTimeDate)
    },

    roundMinutes (mDate) {
      const minutes = mDate.minutes()
      mDate.minutes(minutes - minutes % 5)
      return mDate
    },

    checkSameDay () {
      const sD = moment(this.currentDateStart).startOf('day')
      const eD = moment(this.currentDateEnd).startOf('day')
      this.isSameDay = sD.isSame(eD)
    },

    toggleStartTimeButton () {
      this.closeAllRef()
      if (this.startTimeRef) {
        this.startTimeRef.destroy()
        this.startTimeRef = null
      } else {
        this.currentTimeStart = new Date()
      }
      this.hasStartTime = !this.hasStartTime
      this.updateDatesLater()
    },

    toggleEndTimeButton () {
      this.closeAllRef()
      if (this.endTimeRef) {
        this.endTimeRef.destroy()
        this.endTimeRef = null
      } else {
        if (this.hasStartTime) {
          const mDateStart = moment(this.currentDateStart)
          this.currentTimeEnd = moment(new Date())
            .hours(mDateStart.hours()).minutes(mDateStart.minutes())
            .add(1, 'hour').toDate()
        } else {
          this.currentTimeEnd = moment(new Date()).add(1, 'hour').toDate()
        }
      }
      this.hasEndTime = !this.hasEndTime
      this.updateDatesLater()
    },

    closeAllRef (butNotRef) {
      const allRefs = [this.startDateRef, this.endDateRef, this.startTimeRef, this.endTimeRef]
      for (let i in allRefs) {
        const ref = allRefs[i]
        if (ref !== null && ref !== butNotRef) {
          if (ref.isOpen) {
            ref.close()
          }
        }
      }
    },

    toggleRef (currentRef) {
      this.closeAllRef(currentRef)
      currentRef.toggle()
    },

    toggleStartDatePicker () {
      this.toggleRef(this.startDateRef)
    },

    toggleEndDatePicker () {
      this.toggleRef(this.endDateRef)
    },

    toggleStartTimePicker () {
      this.toggleRef(this.startTimeRef)
    },

    toggleEndTimePicker () {
      this.toggleRef(this.endTimeRef)
    },

    pickerClosed () {
      this.updateDatesLater()
    },

    // needs rendering prior calculating updates dates
    updateDatesLater () {
      this.$nextTick(this.updateDates)
    },

    updateDates () {
      const dayStart = this.startDateRef.selectedDates[0]
      const timeStart = this.startTimeRef && this.startTimeRef.selectedDates.length ? this.startTimeRef.selectedDates[0] : dayStart

      const dateStart = new Date(
        dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate(),
        timeStart.getHours(), timeStart.getMinutes()
      )

      const dayEnd = this.endDateRef.selectedDates[0] || dayStart
      const timeEnd = this.endTimeRef && this.endTimeRef.selectedDates.length ? this.endTimeRef.selectedDates[0] : dayEnd

      let dateEnd = new Date(
        dayEnd.getFullYear(), dayEnd.getMonth(), dayEnd.getDate(),
        timeEnd.getHours(), timeEnd.getMinutes()
      )

      // end date = start day if same day and start day is changed
      const dateStartDidChange = !moment(dateStart).startOf('day').isSame(moment(this.currentDateStart).startOf('day'))
      if (this.isSameDay && dateStartDidChange) {
        dateEnd = dateStart
        this.endDateRef.setDate(dateEnd)
      }

      this.currentDateStart = dateStart
      this.currentDateEnd = dateEnd
      this.checkSameDay()

      this.$emit('input', this.value)
    }
  },

  computed: {
    // used by vee-validator to validate current date
    value () {
      return {
        dateStart: this.currentDateStart,
        dateEnd: this.currentDateEnd,
        hasTimeStart: this.hasStartTime,
        hasTimeEnd: this.hasEndTime
      }
    }
  },

  components: {
    TimePicker,
    DayPicker
  }
}
</script>

<style lang="scss">
  label.clickableElement {
    pointer-events:none;
  }
  span.hideSpan {
    display: none;
  }
  span.isSameDayLabel {
    position: absolute;
    height: 3rem;
    line-height: 3rem;
    color: grey;
  }
  .hidePicker {
    opacity: 0;
  }
  .rowDateAndTime {
    display: flex;
    align-items: baseline;
  }
  .dateField {
    width: 30%;
  }
  .showDateButton {
    padding-left: 0.5em;
    padding-right: 0.45em;
    margin: 0 1em 0 0;
  }
  .showTimeButton {
    padding-left: 0.5em;
    padding-right: 0.45em;
    margin: 0 1em 0 2em;
  }
  /* stylelint-disable selector-class-pattern */
  div.flatpickr-calendar {
    background-color: inherit;
  }
/* stylelint-enable */
  #startDate {
    cursor: hand;
    border-bottom: none;
    color: black;
  }
  #startTime {
    cursor: hand;
    border-bottom: none;
    color: black;
  }
  #endDate {
    cursor: hand;
    border-bottom: none;
    color: black;
  }
  #endTime {
    cursor: hand;
    border-bottom: none;
    color: black;
  }
</style>
