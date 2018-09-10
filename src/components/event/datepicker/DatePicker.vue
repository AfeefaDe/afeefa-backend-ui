<template>
  <div :class="['datePicker', {timePickerOpen: hasStartTime}]">

    <!-- start date and start time  -->
    <div class="rowDate">
      <div>
        <button type="button" @click.prevent.stop="toggleStartDatePicker" class="showDateButton btn waves-effect waves-light">
          <i class="material-icons center">event</i>
        </button>
      </div>

      <day-picker class="dayPicker" ref="startDatePickerRef" :options="dateOptions" @update="dateStartChanged" />

      <div @click.prevent.stop="toggleStartDatePicker" class="dateField">
        {{ formattedDateStart }}
      </div>

      <div>
        <time-picker :date="currentDateStart" :isAllDay="!hasStartTime" @update="timeStartChanged" />
      </div>
    </div>

    <!-- end Date and end time  -->
    <div :class="['rowDate', {timePickerOpen: hasEndTime}]">
      <div>
        <button type="button" @click.prevent.stop="toggleEndDatePicker" class="showDateButton btn waves-effect waves-light">
          <i class="material-icons center">event</i>
        </button>
      </div>

      <day-picker class="dayPicker" ref="endDatePickerRef" :options="dateOptions" @update="dateEndChanged"/>

      <div @click.prevent.stop="toggleEndDatePicker" class="dateField">
        {{ formattedDateEnd }}
      </div>

      <div>
        <time-picker :date="currentDateEnd" :isAllDay="!hasEndTime" @update="timeEndChanged" />
      </div>
    </div>
  </div>
</template>

<script>
import TimePicker from './TimePicker'
import DayPicker from './DayPicker'
import moment from 'moment'
import InputLabel from '@/components/InputLabel'
import formatDay from '@/filters/format-day'

export default {
  props: ['dateStart', 'dateEnd', 'hasTimeStart', 'hasTimeEnd'],

  data () {
    return {
      currentDateStart: null,
      currentDateEnd: null,
      hasStartTime: null,
      hasEndTime: null,

      dateOptions: {
        clickOpens: false,
        enableTime: false,
        dateFormat: 'd.m.Y'
      },

      startDateRef: null,
      endDateRef: null
    }
  },

  created () {
    this.currentDateStart = this.dateStart ? new Date(this.dateStart) : new Date()
    this.currentTimeStart = this.dateStart ? new Date(this.dateStart) : new Date()
    this.currentDateEnd = this.dateEnd ? new Date(this.dateEnd) : new Date()
    this.currentTimeEnd = this.dateEnd ? new Date(this.dateEnd) : new Date()
    this.hasStartTime = this.hasTimeStart
    this.hasEndTime = this.hasTimeEnd

    // set new start date if not existing
    if (this.dateStart === null) {
      this.$emit('input', this.value)
    }
  },

  mounted () {
    this.startDateRef = this.$refs.startDatePickerRef.fp
    const startDay = moment(this.currentDateStart).startOf('day').toDate()
    this.startDateRef.setDate(startDay)

    this.endDateRef = this.$refs.endDatePickerRef.fp
    const endDay = moment(this.currentDateEnd).startOf('day').toDate()
    this.endDateRef.setDate(endDay)
  },

  computed: {
    // used by vee-validator to validate current date
    value () {
      return {
        dateStart: new Date(this.currentDateStart.setSeconds(0)),
        dateEnd: new Date(this.currentDateEnd.setSeconds(0)),
        hasTimeStart: this.hasStartTime,
        hasTimeEnd: this.hasEndTime
      }
    },

    formattedDateStart () {
      return formatDay(this.currentDateStart)
    },

    formattedDateEnd () {
      return this.isSameDay ? 'Gleicher Tag' : formatDay(this.currentDateEnd)
    },

    isSameDay () {
      const sD = moment(this.currentDateStart).startOf('day')
      const eD = moment(this.currentDateEnd).startOf('day')
      return sD.isSame(eD)
    }
  },

  methods: {
    dateStartChanged (dateStart) {
      const wasSameDay = this.isSameDay

      const m = moment(dateStart)
      this.currentDateStart = moment(this.currentDateStart)
        .date(m.date())
        .month(m.month())
        .year(m.year())
        .toDate()

      if (wasSameDay) {
        this.dateEndChanged(dateStart)
      }

      this.updateDates()
    },

    dateEndChanged (dateEnd) {
      const m = moment(dateEnd)
      this.currentDateEnd = moment(this.currentDateEnd)
        .date(m.date())
        .month(m.month())
        .year(m.year())
        .toDate()

      this.updateDates()
    },

    timeStartChanged ({date, isAllDay}) {
      this.currentDateStart = date
      this.hasStartTime = !isAllDay

      this.updateDates()
    },

    timeEndChanged ({date, isAllDay}) {
      this.currentDateEnd = date

      // has time end activated, add 1 hour to date start
      if (!this.hasEndTime && !isAllDay) {
        if (this.hasStartTime) {
          const hours = moment(this.currentDateStart).hours()
          this.currentDateEnd = moment(this.currentDateEnd).hours(hours).add(1, 'hours').toDate()
        }
      }
      this.hasEndTime = !isAllDay

      this.updateDates()
    },

    closeAllRef (butNotRef) {
      const allRefs = [this.startDateRef, this.endDateRef]
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

    updateDates () {
      const startDay = moment(this.currentDateStart).startOf('day').toDate()
      this.startDateRef.setDate(startDay)

      const endDay = moment(this.currentDateEnd).startOf('day').toDate()
      this.endDateRef.setDate(endDay)

      this.$emit('input', this.value)
    }
  },

  components: {
    DayPicker,
    InputLabel,
    TimePicker
  }
}
</script>

<style lang="scss" scoped>
  .datePicker {
    display: table;
  }

  .rowDate {
    display: table-row;
    > * {
      display: table-cell;
      vertical-align: middle;
    }
    &:last-child > * {
      padding-top: 1.5em;
    }
    &.timePickerOpen {
      &:last-child > * {
        padding-top: 0;
      }
    }
  }

  .dayPicker {
    border: none !important;
    width: 0 !important;
    height: 0 !important;
    background-color: red !important;
    visibility: hidden;
    position: relative;
    top: -1em;
    left: -1em;
  }

  .dateField {
    padding-left: .7em;
    padding-right: 1.5em;
    cursor: pointer;
  }

  .showDateButton {
    padding-left: 0.5em;
    padding-right: 0.45em;
  }
</style>

<style lang="scss">
/* stylelint-disable selector-class-pattern */
.flatpickr-calendar {
  /deep/ input {
    padding: 0 0 0 0.5ch !important;
    border: none;
    box-shadow: none;
  }
  /deep/ .numInputWrapper {
    margin-left: .1em;
  }
}
/* stylelint-enable */
</style>
