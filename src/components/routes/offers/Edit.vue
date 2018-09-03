<template>
  <entry-detail :component="this" :isEdit="true">

    <div v-if="offer">
      <image-container v-show="!imageError"
        :imageUrl="offer.image_url"
        @state="updateImageContainerState">
      </image-container>

      <form @submit.prevent="save" class="entryForm" novalidate>
        <title-input :item="item" />

        <text-input
          class="formElement marginTop"
          v-model="offer.description"
          fieldName="description"
          :label="$t('entries.description')"
          :placeholder="$t('entries.description')"
          validate="required|max:350" />

        <media-image-input :item="item" propertyName="image_url" :imageError="imageError" class="formElement marginTop" />

        <entry-edit-footer
          :item="item"
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
import OfferRouteConfig from './OfferRouteConfig'

import ImageContainer from '@/components/ImageContainer'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'
import MediaImageInput from '@/components/entry/edit/MediaImageInput'

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      imageError: false,
      routeConfig: new OfferRouteConfig(this, this.id)
    }
  },

  computed: {
    offer () {
      return this.item
    }
  },

  methods: {
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
    TitleInput,
    DescriptionForm,
    EntryEditFooter,
    ImageContainer,
    MediaImageInput
  }
}
</script>
