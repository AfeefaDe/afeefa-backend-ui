<template>
  <div class="timePicker">
    <div v-if="!currentIsAllDay" class="timeInputs">
      <div class="timeInput">
        <div class="up" @click="hourUp"><i class="material-icons">arrow_drop_up</i></div>
        <input type="text" size="2" maxlength="2"
          :class="['hourInput', 'browser-default', {'validation-error': !hourValid}]"
          v-model="currentHour"
          @blur="updateHoursAndMinute">
        <div class="down" @click="hourDown"><i class="material-icons">arrow_drop_down</i></div>
      </div>

      <div class="hourMinutesSeparator">:</div>

      <div class="timeInput">
        <div class="up" @click="minutesUp"><i class="material-icons">arrow_drop_up</i></div>
        <input type="text" size="2" maxlength="2"
          :class="['minutesInput', 'browser-default', {'validation-error': !minutesValid}]"
          v-model="currentMinutes"
          @blur="updateHoursAndMinute">
        <div class="down" @click="minutesDown"><i class="material-icons">arrow_drop_down</i></div>
      </div>
    </div>

    <div @click.prevent="toggleIsAllDay">
      <input type="checkbox" id="hasTimeStart" class="filled-in blue" v-model="currentIsAllDay"/>
      <label class="allDayCheckbox" for="hasTimeStart">
        Ganztags
      </label>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import formatHour from '@/filters/format-hour'
import formatMinutes from '@/filters/format-minutes'

export default {
  props: ['date', 'isAllDay'],

  data () {
    return {
      currentDate: null,
      currentHour: null,
      currentMinutes: null,
      currentIsAllDay: false
    }
  },

  created () {
    this.currentDate = new Date(this.date)
    this.currentIsAllDay = this.isAllDay
    this.initHourAndMinutes()
  },

  watch: {
    date () {
      this.currentDate = new Date(this.date)
      this.initHourAndMinutes()
    }
  },

  computed: {
    formattedHour () {
      return formatHour(this.currentDate)
    },

    formattedMinutes () {
      return formatMinutes(this.currentDate)
    },

    minutesValid () {
      if (!this.currentMinutes) {
        return true
      }
      if (!/^\d{1,2}$/.test(this.currentMinutes)) {
        return false
      }
      return this.currentMinutes < 60
    },

    hourValid () {
      if (!this.currentHour) {
        return true
      }
      if (!/^\d{1,2}$/.test(this.currentHour)) {
        return false
      }
      return this.currentHour < 24
    }
  },

  methods: {
    initHourAndMinutes () {
      this.currentHour = this.formattedHour
      this.currentMinutes = this.formattedMinutes
    },

    toggleIsAllDay () {
      this.currentIsAllDay = !this.currentIsAllDay
      if (!this.currentIsAllDay) {
        const now = moment(new Date())
        const remainder = 60 - (now.minute() % 60)
        const m = moment(now).add(remainder, 'minutes')

        this.currentDate = moment(this.currentDate)
          .minutes(m.minutes())
          .hour(m.hour())
          .toDate()
      }
      this.dispatchDate()
    },

    updateHoursAndMinute () {
      if (this.hourValid) {
        this.currentDate = moment(this.currentDate).hours(this.currentHour).toDate()
      }

      if (this.minutesValid) {
        this.currentDate = moment(this.currentDate).minutes(this.currentMinutes).toDate()
      }

      this.dispatchDate()
    },

    hourUp () {
      this.currentDate = moment(this.currentDate).add(1, 'hours').toDate()
      this.dispatchDate()
    },

    hourDown () {
      this.currentDate = moment(this.currentDate).subtract(1, 'hours').toDate()
      this.dispatchDate()
    },

    minutesUp () {
      this.currentDate = moment(this.currentDate).add(15, 'minutes').toDate()
      this.dispatchDate()
    },

    minutesDown () {
      this.currentDate = moment(this.currentDate).subtract(15, 'minutes').toDate()
      this.dispatchDate()
    },

    dispatchDate () {
      this.initHourAndMinutes()
      this.$emit('update', { date: this.currentDate, isAllDay: this.currentIsAllDay })
    }
  }
}
</script>

<style lang="scss" scoped>
.timePicker {
  display: flex;
  align-items: center;
  text-align: center;
}

.allDayCheckbox {
  color: inherit;
}

.timeInputs {
  display: flex;
  align-items: center;
  margin-right: 1.5em;
  line-height: 2.5;

  .timeInput > * {
    text-align: center;
  }

  .up {
    @include user-select();
    cursor: pointer;
    line-height: 0;
    margin-bottom: -4px;
  }

  .down {
    @include user-select();
    cursor: pointer;
    line-height: 1;
    margin-top: -4px;
  }

  .hourMinutesSeparator {
    padding: 0 .4em;
  }

  .hourInput {
    text-align: center;
    padding: 0;
  }

  .minutesInput {
    text-align: center;
    padding: 0;
  }
}
</style>
