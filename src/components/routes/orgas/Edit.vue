<template>
  <entry-detail :component="this" :isEdit="true">

    <div v-if="orga">
      <image-container v-show="!imageError"
        :image-url="orga.media_url"
        @state="updateImageContainerState">
      </image-container>

      <form @submit.prevent="save" class="entryForm" novalidate>

        <tab-bar
          :tabNames="tabNames"
          @setCurrentTab="setCurrentTab">

          <section slot="general">
            <h2>Titel und Beschreibung</h2>
            <title-input :item="orga" />
            <description-form :item="orga" />

            <h2>Bild</h2>
            <media-image-input :item="orga" propertyName="media_url" :image-error="imageError" />

            <help-wanted-form :item="orga" />

            <input-field
              field-name="facebook_id"
              v-model="orga.facebook_id"
              validate="min:15|max:64"
              label="Facebook ID für Events">
            </input-field>
          </section>

          <section slot="annotations">
            <annotation-form :item="orga" />
          </section>

          <section slot="resources">
            <resource-form :item="orga" />
          </section>

        </tab-bar>

        <entry-edit-footer
          :item="orga"
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
import OrgaRouteConfig from './OrgaRouteConfig'

import InputField from '@/components/InputField'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

import ImageContainer from '@/components/ImageContainer'
import AnnotationForm from '@/components/entry/edit/AnnotationForm'
import ResourceForm from '@/components/entry/edit/ResourceForm'
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
      routeConfig: new OrgaRouteConfig(this, this.id)
    }
  },

  computed: {
    orga () {
      return this.item
    },

    tabNames () {
      const tabNames = [
        'general',
        {name: 'annotations', hint: this.item.annotations.length}
      ]
      if (this.currentUser && this.currentUser.area === 'dresden') {
        tabNames.push({name: 'resources', hint: this.item.resource_items.length})
      }
      return tabNames
    }
  },

  methods: {
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
    ImageContainer,
    InputField,
    EntryEditFooter,

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
