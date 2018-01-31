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
          <div class="inputField__spacing">
            <label for="orgaType">Typ</label>
            <select v-model="item.orga_type_id" id="orgaType"
              name="orgaType"
              class="browser-default">
              <option :value="orgaType.id" v-for="orgaType in orgaTypes" :key="orgaType.id">{{ orgaType.name }}</option>
            </select>
          </div>

          <div v-if="item.id">
            <h2>Projektträger</h2>

            <project-initiator-selector
              :actor="item"
              @itemAdded="projectInitiatorChanged"
              @itemRemoved="projectInitiatorChanged" />

            <h2>Netzwerke</h2>
            <network-selector :actor="item" />

            <h2>Partner</h2>
            <partner-selector :actor="item" />
          </div>

          <h2>Kategorien</h2>
          <category-selector :item="item" />

          <h2>Titel und Beschreibung</h2>
          <title-input :item="item" />
          <description-form :item="item" />

          <h2>Bild</h2>
          <media-image-input :item="item" :image-error="imageError" />

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
          <contact-form :item="item" />
        </section>

        <section slot="networkMembersTab">
          <network-member-selector :actor="item" />
        </section>

        <section slot="projectsTab">
          <project-selector :actor="item" />
        </section>

        <section slot="resourceTab" v-if="item.type === 'orgas'">
          <resource-form :item="item" />
        </section>

      </tab-bar>

  </entry-edit>
</template>

<script>
import EditEntrySlotMixin from '@/components/entry/edit/mixins/EditEntrySlotMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OrgaRouteConfig from './OrgaRouteConfig'

import Orgas from '@/resources/Orgas'
import OrgaType from '@/models/OrgaType'

import TabBar from '@/components/TabBar'
import PowerSelector from '@/components/PowerSelector'
import InputField from '@/components/InputField'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import LocationForm from '@/components/entry/edit/LocationForm'
import ContactForm from '@/components/entry/edit/ContactForm'
import CategorySelector from '@/components/entry/edit/CategorySelector'
import AnnotationForm from '@/components/entry/edit/AnnotationForm'
import ResourceForm from '@/components/entry/edit/ResourceForm'
import TagSelector from '@/components/entry/edit/TagSelector'
import HelpWantedForm from '@/components/entry/edit/HelpWantedForm'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import MediaImageInput from '@/components/entry/edit/MediaImageInput'

import ProjectInitiatorSelector from '@/components/entry/edit/actor-relations/ProjectInitiatorSelector'
import NetworkSelector from '@/components/entry/edit/actor-relations/NetworkSelector'
import PartnerSelector from '@/components/entry/edit/actor-relations/PartnerSelector'
import ProjectSelector from '@/components/entry/edit/actor-relations/ProjectSelector'
import NetworkMemberSelector from '@/components/entry/edit/actor-relations/NetworkMemberSelector'

export default {
  mixins: [BeforeRouteLeaveMixin, EditEntrySlotMixin],

  props: ['id'],

  data () {
    return {
      currentTab: '',
      routeConfig: new OrgaRouteConfig(this, this.id)
    }
  },

  computed: {
    orgaTypes () {
      return OrgaType.TYPES
    },

    tabNames () {
      let tabNames = [
        'generalTab',
        {name: 'annotationsTab', hint: this.item.annotations.length},
        'placeTab',
        'contactTab'
      ]
      if (this.currentUser && this.currentUser.area === 'dresden') {
        tabNames.push({name: 'resourceTab', hint: this.item.resource_items.length})
      }
      tabNames.push({name: 'networkMembersTab', hint: this.item.network_members.length})
      tabNames.push({name: 'projectsTab', hint: this.item.projects.length})
      return tabNames
    }
  },

  methods: {
    projectInitiatorChanged () {
      const parentOrga = this.item.project_initiators[0]
      if (parentOrga) {
        Orgas.get(parentOrga.id, ['fetchContact']).then(orga => {
          this.item.parent_orga = orga
        })
      } else {
        this.item.parent_orga = null
      }
    },

    setCurrentTab (tab) {
      this.currentTab = tab
    }
  },

  components: {
    EntryEdit,

    TabBar,
    InputField,
    PowerSelector,

    TitleInput,
    ContactForm,
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
