<template>
  <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
    <section slot="generalTab">
      <div class="inputField__spacing">
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
</template>


<script>
import OrgaType from '@/models/OrgaType'

import TabBar from '@/components/TabBar'
import PowerSelector from '@/components/PowerSelector'
import InputField from '@/components/InputField'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import LocationForm from '@/components/entry/edit//LocationForm'
import EditContactInfo from '@/components/entry/edit//EditContactInfo'
import CategorySelector from '@/components/entry/edit//CategorySelector'
import AnnotationForm from '@/components/entry/edit//AnnotationForm'
import ResourceForm from '@/components/entry/edit//ResourceForm'
import TagSelector from '@/components/entry/edit//TagSelector'
import HelpWantedForm from '@/components/entry/edit//HelpWantedForm'
import TitleInput from '@/components/entry/edit//TitleInput'
import DescriptionForm from '@/components/entry/edit//DescriptionForm'
import MediaImageInput from '@/components/entry/edit//MediaImageInput'

import ProjectInitiatorSelector from '@/components/entry/edit//actor-relations/ProjectInitiatorSelector'
import NetworkSelector from '@/components/entry/edit//actor-relations/NetworkSelector'
import PartnerSelector from '@/components/entry/edit//actor-relations/PartnerSelector'
import ProjectSelector from '@/components/entry/edit//actor-relations/ProjectSelector'
import NetworkMemberSelector from '@/components/entry/edit//actor-relations/NetworkMemberSelector'

export default {
  props: ['item', 'currentUser', 'imageError'],

  inject: ['$validator'],

  data () {
    return {
      currentTab: ''
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
    }
  },

  components: {
    TabBar,
    InputField,
    PowerSelector,

    EntryEdit,
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
