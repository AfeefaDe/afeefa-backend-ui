<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard" v-if="item">
        <entry-edit-header :item="item" :routeConfig="routeConfig" />

        <image-container v-if="item" v-show="!imageError"
          :image-url="item.media_url"
          @state="updateImageContainerState">
        </image-container>

        <div>
          <form @submit.prevent="save" class="entryForm" novalidate>
            <tab-bar :tabNames="tabNames" @setCurrentTab="setCurrentTab">

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
                  @input="updateInheritedContactInfo">
                </edit-contact-info>
              </section>

            </tab-bar>

            <section class="entryForm__actionFooter">
              <button class="btn waves-effect waves-light saveButton" type="submit">
                <i class="material-icons left">done</i>
                Speichern
              </button>
              <button class="btn waves-effect waves-light red" @click.prevent="remove">
                <i class="material-icons left">delete</i>
                Löschen
              </button>
            </section>
          </form>
        </div>
      </div>

      <div v-else class="mainCard">
        <div class="mainCard__header mainCard__headerLight">
          <span v-if="hasItemLoadingError">{{ messages.loadingItemError() }} ...</span>
          <span v-else>{{ messages.loadingItem() }} ...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EntryApiMixin from '@/components/entry/edit/mixins/EntryApiMixin'
import Orgas from '@/resources/Orgas'

import TabBar from '@/components/TabBar'
import ImageContainer from '@/components/ImageContainer'
import InputField from '@/components/InputField'
import PowerSelector from '@/components/PowerSelector'

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
  mixins: [EntryApiMixin],

  props: ['id'],

  data () {
    return {
      currentTab: null,
      parentOrgas: [],
      imageError: false
    }
  },

  computed: {
    tabNames () {
      return ['generalTab', 'annotationsTab', 'placeTab', 'contactTab']
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
      this.item.parent_orga = parentOrga
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

    updateInheritedContactInfo (inheritanceState) {
      this.item.inheritance.contact_infos = inheritanceState
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
    TabBar,
    InputField,
    PowerSelector,

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
