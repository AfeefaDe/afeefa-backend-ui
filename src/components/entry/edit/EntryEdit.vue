<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard" v-if="item">
        <entry-edit-header :item="item" :routeConfig="routeConfig" />

        <image-container v-if="item" v-show="!imageError"
          :image-url="item.media_url"
          @state="updateImageContainerState">
        </image-container>

        <div v-if="item">
          <form @submit.prevent="save" class="entryForm" novalidate>
            <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">

              <section slot="generalTab">
                <div class="inputField__spacing" v-if="item.type === 'orgas'">
                  <label for="orgaType">Typ</label>
                  <select v-model="item.orga_type_id" id="orgaType"
                   name="orgaType"
                    :class="['browser-default']">
                    <option :value="orgaType.id" v-for="orgaType in orgaTypes" :key="orgaType.id">{{ orgaType.name }}</option>
                  </select>
                </div>

                <div v-if="item.id">
                  <h2>Projektträger</h2>

                  <project-initiator-selector :actor="item" />

                  <h2>Netzwerke</h2>

                  <network-selector :actor="item" />

                  <h2>Partner</h2>

                  <partner-selector :actor="item" />
                </div>

                <h2>Kategorien</h2>

                <category-selector :item="item" />

                <br>

                <title-input :item="item" />

                <media-image-input :item="item" :image-error="imageError" />

                <description-form :item="item" />

                <br>

                <tag-selector :item="item" v-if="currentUser && currentUser.area=='dresden'" />

                <help-wanted-form :item="item" />

                <input-field
                  field-name="facebook_id"
                  v-model="item.facebook_id"
                  validate="min:15|max:64"
                  label="Facebook ID für Events">
                </input-field>
              </section>

              <section slot="annotationsTab">
                <annotation-form :item="item" />
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

              <section slot="networkMembersTab">
                <network-member-selector :actor="this.item" />
              </section>

              <section slot="projectsTab">
                <project-selector :actor="this.item" />
              </section>

              <section slot="resourceTab" v-if="item.type === 'orgas'">
                <resource-form :item="item" />
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

        <div v-else class="mainCard">
          <div class="mainCard__header mainCard__headerLight">
            <span v-if="hasItemLoadingError">{{ messages.loadingItemError() }} ...</span>
            <span v-else>{{ messages.loadingItem() }} ...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Multiselect from 'vue-multiselect'
import OrgaType from '@/models/OrgaType'
import ImageContainer from '@/components/ImageContainer'
import TabBar from '@/components/TabBar'
import PowerSelector from '@/components/PowerSelector'
import InputField from '@/components/InputField'

import EntryEditHeader from '@/components/entry/edit/EntryEditHeader'
import LocationForm from './LocationForm'
import EditContactInfo from './EditContactInfo'
import CategorySelector from './CategorySelector'
import AnnotationForm from './AnnotationForm'
import ResourceForm from './ResourceForm'
import TagSelector from './TagSelector'
import HelpWantedForm from './HelpWantedForm'
import TitleInput from './TitleInput'
import DescriptionForm from './DescriptionForm'
import MediaImageInput from './MediaImageInput'

import ProjectInitiatorSelector from './actor-relations/ProjectInitiatorSelector'
import NetworkSelector from './actor-relations/NetworkSelector'
import PartnerSelector from './actor-relations/PartnerSelector'
import ProjectSelector from './actor-relations/ProjectSelector'
import NetworkMemberSelector from './actor-relations/NetworkMemberSelector'

import EntryApiMixin from '@/components/entry/edit/mixins/EntryApiMixin'

export default {
  mixins: [EntryApiMixin],

  props: ['id'],

  data () {
    return {
      currentTab: '',
      imageError: false
    }
  },

  computed: {
    orgaTypes () {
      return OrgaType.TYPES
    },

    /*
     * define tabNames according to the entry type and the area of the current user
     */
    tabNames () {
      let tabNames = ['generalTab', 'annotationsTab', 'placeTab', 'contactTab']
      if (this.currentUser.area === 'dresden') {
        tabNames.push('resourceTab')
      }
      tabNames.push('networkMembersTab')
      tabNames.push('projectsTab')
      return tabNames
    }
  },

  methods: {
    setCurrentTab (tab) {
      this.currentTab = tab
    },

    updateInheritedContactInfo (inheritanceState) {
      this.item.inheritance.contact_infos = inheritanceState
    },

    updateImageContainerState ({mediaImageError}) {
      this.imageError = mediaImageError
    }
  },

  components: {
    ImageContainer,
    TabBar,
    Multiselect,
    InputField,
    PowerSelector,

    EntryEditHeader,
    TitleInput,
    EditContactInfo,
    LocationForm,
    CategorySelector,
    AnnotationForm,
    ResourceForm,
    TagSelector,
    HelpWantedForm,
    DescriptionForm,
    MediaImageInput,

    ProjectInitiatorSelector,
    NetworkSelector,
    PartnerSelector,
    ProjectSelector,
    NetworkMemberSelector
  }
}
</script>
