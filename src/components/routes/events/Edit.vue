<template>
  <entry-detail :component="this" :isEdit="true">

    <div v-if="event">
      <image-container v-show="!imageError"
        :image-url="event.media_url"
        @state="updateImageContainerState">
      </image-container>

      <form @submit.prevent="save" class="entryForm" novalidate>

        <tab-bar
          :tabNames="tabNames"
          @setCurrentTab="setCurrentTab">

          <section slot="general">
            <title-input :item="event" />

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

            <description-form :item="event" />

            <media-image-input :item="event" propertyName="media_url" :image-error="imageError" class="formElement marginTop" />

            <help-wanted-form :item="event" class="formElement marginTop" />
          </section>

        </tab-bar>

        <entry-edit-footer
          :item="event"
          :routeConfig="routeConfig"
          @remove="remove"
          @save="save" />
      </form>

    </div>

  </entry-detail>
</template>


<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EventRouteConfig from './EventRouteConfig'

import ImageContainer from '@/components/ImageContainer'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

import DatePicker from '@/components/event/datepicker/DatePicker'
import TagSelector from '@/components/entry/edit/TagSelector'
import HelpWantedForm from '@/components/entry/edit/HelpWantedForm'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import MediaImageInput from '@/components/entry/edit/MediaImageInput'

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      currentTab: '',
      imageError: false,
      routeConfig: new EventRouteConfig(this, this.id)
    }
  },

  computed: {
    event () {
      return this.item
    },

    tabNames () {
      return ['general']
    }
  },

  methods: {
    updateDatePickerValues ({dateStart, dateEnd, hasTimeStart, hasTimeEnd}) {
      this.item.date_start = dateStart
      this.item.date_end = dateEnd
      this.item.has_time_start = hasTimeStart
      this.item.has_time_end = hasTimeEnd
    },

    setCurrentTab (tab) {
      this.currentTab = tab
    },

    updateImageContainerState ({mediaImageError}) {
      this.imageError = mediaImageError
    },

    validateCustomFields (validationErrors) {
      if (this.imageError) {
        validationErrors.push({
          msg: this.$t('errors.loadingImageError')
        })
      }
    }
  },

  components: {
    EntryEditFooter,

    TitleInput,
    TagSelector,
    HelpWantedForm,
    DescriptionForm,
    MediaImageInput,

    ImageContainer,
    DatePicker
  }
}
</script>
