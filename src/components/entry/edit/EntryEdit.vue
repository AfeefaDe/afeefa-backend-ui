<template>
  <afeefa-page>

    <entry-header :entry="item" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content" v-if="item">
      <image-container v-if="item" v-show="!imageError"
        :image-url="item.media_url"
        @state="updateImageContainerState">
      </image-container>

      <div>
        <form @submit.prevent="save" class="entryForm" novalidate>

          <slot />

          <entry-edit-footer
            :item="item"
            :routeConfig="routeConfig"
            @remove="remove"
            @save="save"
            @cancel="cancel" />
        </form>
      </div>
    </div>

    <div slot="content" v-else>
      <entry-loading-message2 :error="hasItemLoadingError" :messages="messages" />
    </div>

  </afeefa-page>
</template>


<script>
import ImageContainer from '@/components/ImageContainer'

import EntryLoadingMessage2 from '@/components/entry/EntryLoadingMessage2'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

import EntryEditApiMixin from '@/components/entry/edit/mixins/EntryEditApiMixin'

export default {
  mixins: [EntryEditApiMixin],

  props: ['id'],

  data () {
    return {
      imageError: false
    }
  },

  methods: {
    cancel () {
      this.$refs.header.cancel()
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

    EntryLoadingMessage2,
    EntryEditFooter
  }
}
</script>
