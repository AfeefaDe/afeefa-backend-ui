<template>
  <afeefa-page>

    <entry-header :entry="event" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <form @submit.prevent="save" class="entryForm" novalidate>
        <title-input :item="item" />

        <date-picker
          :date-start="event.date_start"
          :date-end="event.date_end"
          :has-time-start="event.has_time_start"
          :has-time-end="event.has_time_end"
          @input="updateDatePickerValues"
          name="date" v-validate="'date-end-not-earlier-than-start|date-end-not-start'"
          :class="['inputField__spacing', {'validation-error': errors.has('date') }]"
          >
        </date-picker>
        <span v-show="errors.has('date')" class="validation-error">{{ errors.first('date') }}</span>

        <description-form :item="event" :options="{description: false}" />

        <entry-edit-footer
          :item="event"
          :routeConfig="routeConfig"
          @save="save" />
      </form>
    </div>

  </afeefa-page>
</template>


<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EventRouteConfig from './EventRouteConfig'

import TitleInput from '@/components/entry/edit/TitleInput'
import DatePicker from '@/components/event/datepicker/DatePicker'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this)
    }
  },

  computed: {
    event () {
      return this.item
    }
  },

  methods: {
    updateDatePickerValues ({dateStart, dateEnd, hasTimeStart, hasTimeEnd}) {
      this.item.date_start = dateStart
      this.item.date_end = dateEnd
      this.item.has_time_start = hasTimeStart
      this.item.has_time_end = hasTimeEnd
    }
  },

  components: {
    TitleInput,
    DatePicker,
    DescriptionForm,
    EntryEditFooter
  }
}
</script>
