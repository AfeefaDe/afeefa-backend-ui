<template>
  <entry-edit
    :id="id"
    :routeConfig="routeConfig"
    ref="form">

      <tab-bar
        v-if="item"
        :tabNames="tabNames"
        @setCurrentTab="setCurrentTab">

        <section slot="generalTab">
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

        <section slot="resourceTab" v-if="item.type === 'orgas'">
          <resource-form :item="item" />
        </section>

      </tab-bar>

  </entry-edit>
</template>

<script>
import EntryEditApiSlotMixin from '@/components/entry/edit/mixins/EntryEditApiSlotMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OrgaRouteConfig from './OrgaRouteConfig'

import TabBar from '@/components/TabBar'
import PowerSelector from '@/components/PowerSelector'
import InputField from '@/components/InputField'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import AnnotationForm from '@/components/entry/edit/AnnotationForm'
import ResourceForm from '@/components/entry/edit/ResourceForm'
import TagSelector from '@/components/entry/edit/TagSelector'
import HelpWantedForm from '@/components/entry/edit/HelpWantedForm'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import MediaImageInput from '@/components/entry/edit/MediaImageInput'

export default {
  mixins: [BeforeRouteLeaveMixin, EntryEditApiSlotMixin],

  props: ['id'],

  data () {
    return {
      currentTab: '',
      routeConfig: new OrgaRouteConfig(this, this.id)
    }
  },

  computed: {
    tabNames () {
      const tabNames = [
        'generalTab',
        {name: 'annotationsTab', hint: this.item.annotations.length}
      ]
      if (this.currentUser && this.currentUser.area === 'dresden') {
        tabNames.push({name: 'resourceTab', hint: this.item.resource_items.length})
      }
      return tabNames
    }
  },

  methods: {
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
    AnnotationForm,
    ResourceForm,
    TagSelector,
    HelpWantedForm,
    DescriptionForm,
    MediaImageInput
  }
}
</script>
