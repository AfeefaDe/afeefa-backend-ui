<template>
  <afeefa-page>

    <entry-header :entry="event" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <form @submit.prevent="save" class="entryForm" novalidate>
        <entry-detail-property title="Veranstalter" icon="group" class="hosts">
          <actor-selector :actor="event" relationName="hosts" title="Veranstalter" />
        </entry-detail-property>

        <title-input :item="item" class="formElement marginTop" />

        <input-label
          class="formElement marginTop"
          name="date" :title="eventDate"
          :validationErrors="errors" />

        <date-picker
          :date-start="event.date_start"
          :date-end="event.date_end"
          :has-time-start="event.has_time_start"
          :has-time-end="event.has_time_end"
          @input="updateDatePickerValues"
          name="date" v-validate="'date-end-not-earlier-than-start|date-end-not-start'"
          :validationErrors="errors"
          >
        </date-picker>

        <description-form class="formElement marginTop" :item="event" :options="{description: false}" />

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
import ActorSelector from '@/components/actor/ActorSelector'
import InputLabel from '@/components/InputLabel'
import formatDateRelative from '@/filters/format-date-relative'
import formatEventDate from '@/filters/format-event-date'

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
    },

    eventDate () {
      return `${formatEventDate(this.event)} (${formatDateRelative(this.event.date_start)})`
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
    ActorSelector,
    InputLabel
  }
}
</script>

<style lang="scss" scoped>
.entryDetailProperty.hosts {
  /deep/ .title {
    font-size: .9rem;
  }
  /deep/ .editLink {
    top: 0;
    left: .5em;
  }
}

.editableActors {
  margin-top: .8em;
}

.eventDate {
  margin-top: .6em;
}

.datePicker {
  margin-top: 1.5em;
  &.timePickerOpen {
    margin-top: .5em;
  }
}
</style>
