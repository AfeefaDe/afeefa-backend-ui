<template>
  <afeefa-page>

    <entry-header :entry="event" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <form @submit.prevent="save" class="entryForm" novalidate>
        <editable-event-hosts :owner="event" relationName="hosts" title="Veranstalter" showActors="true">
          <div slot="actor" slot-scope="props">
            <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
              {{ props.actor.title }}
            </router-link>
          </div>
        </editable-event-hosts>

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
import Orga from '@/models/Orga'
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EventRouteConfig from './EventRouteConfig'

import TitleInput from '@/components/entry/edit/TitleInput'
import DatePicker from '@/components/event/datepicker/DatePicker'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'
import EditableEventHosts from '@/components/actor/EditableEventHosts'

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this)
    }
  },

  created () {
    this.initActor()
  },

  watch: {
    '$route.query' () {
      this.initActor()
    }
  },

  computed: {
    event () {
      return this.item
    }
  },

  methods: {
    setActor (actor) {
      const hasChanges = this.event.hasChanges()
      if (actor) {
        this.event.hosts = [actor]
      } else {
        this.event.hosts = []
      }
      if (!hasChanges) {
        // prevent raising a dirty form dialog on leaving without changing data
        this.event.markSaved()
      }
    },

    initActor () {
      if (this.$route.query.actorId) {
        Orga.Query.get(this.$route.query.actorId).then(actor => {
          this.setActor(actor)
        })
      } else {
        this.setActor(null)
      }
    },

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
    EntryEditFooter,
    EditableEventHosts
  }
}
</script>
