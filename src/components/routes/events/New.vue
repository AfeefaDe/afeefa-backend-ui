<template>
  <entry-edit
    id=""
    :route-config="routeConfig"
    ref="form">

    <div v-if="item">
      <title-input :item="item" />

      <category-selector :item="item" />

      <date-picker
        :date-start="item.date_start"
        :date-end="item.date_end"
        :has-time-start="item.has_time_start"
        :has-time-end="item.has_time_end"
        @input="updateDatePickerValues"
        name="date" v-validate="'date-end-not-earlier-than-start|date-end-not-start'"
        :class="['inputField__spacing', {'validation-error': errors.has('date') }]"
        >
      </date-picker>
      <span v-show="errors.has('date')" class="validation-error">{{ errors.first('date') }}</span>

      <description-form :item="item" :options="{description: false}" />
    </div>

  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EditEntrySlotMixin from '@/components/entry/edit/mixins/EditEntrySlotMixin'

import EventRouteConfig from './EventRouteConfig'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import TitleInput from '@/components/entry/edit/TitleInput'
import CategorySelector from '@/components/entry/edit/CategorySelector'
import DatePicker from '@/components/event/datepicker/DatePicker'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'

export default {
  mixins: [BeforeRouteLeaveMixin, EditEntrySlotMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this)
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
    EntryEdit,
    TitleInput,
    CategorySelector,
    DatePicker,
    DescriptionForm
  }
}
</script>
