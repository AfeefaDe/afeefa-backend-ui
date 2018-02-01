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

            <slot />

            <section class="entryForm__actionFooter">
              <button class="btn waves-effect waves-light saveButton" type="submit">
                <i class="material-icons left">done</i>
                {{ item.id ? 'Speichern' : 'Anlegen' }}
              </button>
              <button class="btn waves-effect waves-light red" @click.prevent="remove" v-if="item.id">
                <i class="material-icons left">delete</i>
                Löschen
              </button>
            </section>

          </form>
        </div>
      </div>

      <entry-loading-message v-else :error="hasItemLoadingError" :messages="messages" />
    </div>
  </div>
</template>


<script>
import ImageContainer from '@/components/ImageContainer'

import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryEditHeader from '@/components/entry/edit/EntryEditHeader'

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

    EntryLoadingMessage,
    EntryEditHeader
  }
}
</script>
