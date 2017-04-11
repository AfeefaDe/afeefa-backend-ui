<template>
  <div class="datePicker">

    <!-- start date and start time  -->
    <div class=row-DateAndTime>
      <button @click.prevent.stop="toggleStartDatePicker" class="showDate-button btn waves-effect waves-light">
        <i class="material-icons center">event</i>
      </button>

      <div @click.prevent.stop="toggleStartDatePicker" class="date-field start-date-field inputField__spacing input-field">
        <label for="startDate" :class="['clickable-element', {active: currentDateStart}]">{{ $t("entries.date_start") }}</label>
        <day-picker ref="startDatePickerRef" id="startDate" :options="dateOptions"/>
      </div>

      <template v-if="hasStartTime">
        <button @click.prevent.stop="toggleStartTimeButton" class="red showTime-button btn waves-effect waves-light">
          <i class="material-icons center">delete_forever</i>
        </button>
        <div @click.prevent.stop="toggleStartTimePicker" class="date-field start-time-field inputField__spacing input-field">
          <label for="startTime" :class="['clickable-element', {active: currentTimeStart}]">{{ $t("entries.time_start") }}</label>
          <time-picker id="startTime" :options="timeOptions" @FlatpickrRef="setStartTimeRef"/>
        </div>
      </template>
      <template v-else>
        <button @click.prevent.stop="toggleStartTimeButton" class="showTime-button btn waves-effect waves-light">
          <i class="material-icons center">alarm</i>
        </button>
      </template>
    </div>

    <!-- end Date and end time  -->
    <div class=row-DateAndTime>
      <button @click.prevent.stop="toggleEndDatePicker" class="showDate-button btn waves-effect waves-light">
        <i class="material-icons center">event</i>
      </button>

      <div @click.prevent.stop="toggleEndDatePicker" class="date-field end-date-field inputField__spacing input-field">
        <label for="endDate" :class="['clickable-element', {active: currentDateEnd}]">{{ $t("entries.date_end") }}</label>
        <span :class="['clickable-element', 'is-same-day-label', {'hide-span': !isSameDay}]"> Gleicher Tag </span>
        <day-picker :class="{'hide-picker': isSameDay}" ref="endDatePickerRef" id="endDate" :options="dateOptions"/>
      </div>

      <template v-if="hasEndTime">
        <button @click.prevent.stop="toggleEndTimeButton" class="red showTime-button btn waves-effect waves-light">
          <i class="material-icons center">delete_forever</i>
        </button>

        <div @click.prevent.stop="toggleEndTimePicker" class="date-field end-time-field inputField__spacing input-field">
          <label for="endTime" :class="['clickable-element', {active: currentTimeEnd}]">{{ $t("entries.time_end") }}</label>
          <time-picker id="endTime" :options="timeOptions" @FlatpickrRef="setEndTimeRef"/>
        </div>
      </template>
      <template v-else>
        <button @click.prevent.stop="toggleEndTimeButton" class="showTime-button btn waves-effect waves-light">
          <i class="material-icons center">alarm</i>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import TimePicker from '@/components/TimePicker'
import DayPicker from '@/components/DayPicker'
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
          this.currentTimeEnd = moment(new Date())
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

      this.$emit('input', {dateStart, dateEnd, hasTimeStart: this.hasStartTime, hasTimeEnd: this.hasEndTime})
    }
  },

  components: {
    TimePicker,
    DayPicker
  }
}
</script>

<style lang="scss">
  label.clickable-element {
    pointer-events:none
  }
  span.hide-span {
    display: none;
  }
  span.is-same-day-label {
    position: absolute;
    height: 3rem;
    line-height: 3rem;
    color: grey;
  }
  .hide-picker {
    opacity: 0;
  }
  .row-DateAndTime {
    display: flex;
    align-items: baseline;
  }
  .date-field {
    width: 30%;
  }
  .showDate-button {
    padding-left: 0.5em;
    padding-right: 0.45em;
    margin: 0em 1em 0em 0em;
  }
  .showTime-button {
    padding-left: 0.5em;
    padding-right: 0.45em;
    margin: 0em 1em 0em 2em;
  }
  #startDate {
    cursor: pointer; cursor: hand;
    border-bottom: none;
  }
  #startTime {
    cursor: pointer; cursor: hand;
    border-bottom: none;
  }
  #endDate {
    cursor: pointer; cursor: hand;
    color: inherit;
    border-bottom: none;
  }
  #endTime {
    cursor: pointer; cursor: hand;
    border-bottom: none;
  }
</style>
