<template>
  <entry-detail :component="this" :isEdit="true">

    <div v-if="orga">
      <image-container v-show="!imageError"
        :image-url="orga.media_url"
        @state="updateImageContainerState">
      </image-container>

      <form @submit.prevent="save" class="entryForm" novalidate>
        <title-input :item="orga" />
        <description-form :item="orga" class="formElement marginTop" />

        <media-image-input :item="orga" propertyName="media_url" :image-error="imageError" class="formElement marginTop" />

        <help-wanted-form :item="orga" class="formElement marginTop" />

        <input-field
          class="formElement marginTop"
          field-name="facebook_id"
          v-model="orga.facebook_id"
          validate="min:15|max:64"
          label="Facebook ID für Events">
        </input-field>

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

import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

import ImageContainer from '@/components/ImageContainer'
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
    EntryEditFooter,

    TitleInput,
    TagSelector,
    HelpWantedForm,
    DescriptionForm,
    MediaImageInput
  }
}
</script>
