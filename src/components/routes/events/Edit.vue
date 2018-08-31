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
            <h2>Titel</h2>

            <title-input :item="event" />

            <h2>{{ $t("headlines.time") }}</h2>

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

            <h2>{{ $t('headlines.organizer')}}</h2>

            <h2>Beschreibung</h2>

            <description-form :item="event" />

            <h2>Bild</h2>

            <media-image-input :item="event" propertyName="media_url" :image-error="imageError" />

            <h2>Tags</h2>

            <tag-selector :item="event" v-if="currentUser && currentUser.area=='dresden'" />

            <h2>Hilfe und Zertifikat</h2>

            <help-wanted-form :item="event" />
          </section>

          <section slot="annotations">
            <annotation-form :item="event" />
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
import InputField from '@/components/InputField'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

import AnnotationForm from '@/components/entry/edit/AnnotationForm'
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
      return [
        'general',
        { name: 'annotations', hint: this.item.annotations.length }
      ]
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
    InputField,
    EntryEditFooter,

    TitleInput,
    AnnotationForm,
    TagSelector,
    HelpWantedForm,
    DescriptionForm,
    MediaImageInput,

    ImageContainer,
    DatePicker
  }
}
</script>
