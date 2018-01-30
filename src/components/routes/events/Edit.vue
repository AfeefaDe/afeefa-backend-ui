<template>
  <entry-edit
    :id="id"
    :route-config="routeConfig"
    ref="form">

      <tab-bar
        v-if="item"
        :tabNames="tabNames"
        @setCurrentTab="setCurrentTab">

        <section slot="generalTab">
          <h2>Titel</h2>

          <title-input :item="item" />

          <h2>{{ $t("headlines.time") }}</h2>

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

          <h2>{{ $t('headlines.organizer')}}</h2>

          <power-selector
            :items="orgas"
            :selected-items="parentOrgas"
            :search-fields="['title']"
            @select="parentOrgaChanged"
            @remove="parentOrgaRemoved"
            :messages="{
              addButtonTitle: 'Veranstalter hinzufügen',
              removeTitle: 'Veranstalter entfernen?',
              removeMessage: actor => {
                return `Soll der Veranstalter entfernt werden?`
              }
            }">
            <div slot="selected-item" slot-scope="props">
              <div>{{ props.item.title }}</div>
            </div>
            <div slot="item" slot-scope="props">
              <div>{{ props.item.title }}</div>
            </div>
          </power-selector>

          <h2>Kategorien</h2>

          <category-selector :item="item" />

          <h2>Beschreibung</h2>

          <description-form :item="item" />

          <h2>Bild</h2>

          <media-image-input :item="item" :image-error="imageError" />

          <h2>Tags</h2>

          <tag-selector :item="item" v-if="currentUser && currentUser.area=='dresden'" />

          <h2>Hilfe und Zertifikat</h2>

          <help-wanted-form :item="item" />
        </section>

        <section slot="annotationsTab">
          <annotation-form :item="item">
          </annotation-form>
        </section>

        <section slot="placeTab">
          <location-form
            :location="item.location"
            :currentTab="currentTab"
            v-if="item.location">
          </location-form>
        </section>

        <section slot="contactTab">
          <edit-contact-info ref="EditContactInfo" v-if="item.contact"
            :contact-info="item.contact"
            :inheritance-state="item.inheritance.contact_infos"
            :type="item.type"
            :parent-orga="item.parent_orga"
            @inheritanceChanged="setContactInfoInheritance">
          </edit-contact-info>
        </section>

      </tab-bar>

  </entry-edit>
</template>

<script>
import EditEntrySlotMixin from '@/components/entry/edit/mixins/EditEntrySlotMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EventRouteConfig from './EventRouteConfig'

import Orgas from '@/resources/Orgas'

import TabBar from '@/components/TabBar'
import ImageContainer from '@/components/ImageContainer'
import InputField from '@/components/InputField'
import PowerSelector from '@/components/PowerSelector'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryEditHeader from '@/components/entry/edit/EntryEditHeader'
import CategorySelector from '@/components/entry/edit/CategorySelector'
import LocationForm from '@/components/entry/edit/LocationForm'
import EditContactInfo from '@/components/entry/edit/EditContactInfo'
import AnnotationForm from '@/components/entry/edit/AnnotationForm'
import DatePicker from '@/components/event/datepicker/DatePicker'
import TagSelector from '@/components/entry/edit/TagSelector'
import HelpWantedForm from '@/components/entry/edit/HelpWantedForm'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import MediaImageInput from '@/components/entry/edit/MediaImageInput'

export default {
  mixins: [BeforeRouteLeaveMixin, EditEntrySlotMixin],

  props: ['id'],

  data () {
    return {
      currentTab: null,
      parentOrgas: [],
      routeConfig: new EventRouteConfig(this, this.id)
    }
  },

  computed: {
    tabNames () {
      return [
        'generalTab',
        { name: 'annotationsTab', hint: this.item.annotations.length },
        'placeTab',
        'contactTab'
      ]
    }
  },

  watch: {
    'item.parent_orga' (orga) {
      this.parentOrgas = orga ? [orga] : []
    }
  },

  methods: {
    updateDatePickerValues ({dateStart, dateEnd, hasTimeStart, hasTimeEnd}) {
      this.item.date_start = dateStart
      this.item.date_end = dateEnd
      this.item.has_time_start = hasTimeStart
      this.item.has_time_end = hasTimeEnd
    },

    parentOrgaChanged (parentOrga) {
      Orgas.get(parentOrga.id, ['fetchContact']).then(orga => {
        this.item.parent_orga = orga
        this.parentOrgas = [orga]
      })
    },

    parentOrgaRemoved () {
      this.item.parent_orga = null
      this.parentOrgas = []
    },

    setCurrentTab (tab) {
      this.currentTab = tab
    },

    setContactInfoInheritance (inheritContactInfos) {
      this.item.inheritance.contact_infos = inheritContactInfos
    }
  },

  components: {
    EntryEdit,

    TabBar,
    InputField,
    PowerSelector,

    EntryLoadingMessage,
    EntryEditHeader,
    TitleInput,
    EditContactInfo,
    LocationForm,
    AnnotationForm,
    TagSelector,
    HelpWantedForm,
    DescriptionForm,
    MediaImageInput,

    ImageContainer,
    CategorySelector,
    DatePicker
  }
}
</script>
