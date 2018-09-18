<template>
  <span>
    <a v-if="entryVisibleInFrontend" :href="previewLink" target="_blank" class="btn btn-medium">
      <i class="material-icons left">link</i>
      {{ $t('headlines.preview') }}
    </a>

    <a class="btn btn-medium" href="" @click.prevent="togglePublishState" v-if="entry.active">
      <i class="material-icons left">visibility_off</i>
      {{ $t('buttons.deactivate') }}
    </a>

    <a class="btn btn-medium green" href="" @click.prevent="togglePublishState" v-else>
      <i class="material-icons left">visibility</i>
      {{ $t('buttons.activate') }}
    </a>
  </span>
</template>

<script>
import slugify from '@/helpers/slugify'
import GenerateFrontendLinkMixin from '@/components/mixins/GenerateFrontendLinkMixin'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [GenerateFrontendLinkMixin, RouteConfigAwareMixin],

  props: ['entry'],

  methods: {
    goBack () {
      this.$router.go(-1)
    },

    togglePublishState () {
      this.$store.dispatch('messages/showDialog', {
        title: this.messages.activateItemDialogTitle(this.entry),
        message: this.messages.activateItemDialogMessage(this.entry)
      }).then(result => {
        if (result === 'yes') {
          const attributes = {
            active: !this.entry.active
          }
          this.Model.Query.updateAttributes(this.entry, attributes).then(attributes => {
            if (attributes) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.activateItemSuccess(this.entry)
              })
            }
          })
        }
      })
    }
  },

  computed: {
    entryVisibleInFrontend () {
      // not active
      if (!this.entry.active) {
        return false
      }
      // past event
      if (this.entry.type === 'events' && !this.entry.isUpcoming) {
        return false
      }
      return true
    },

    previewLink () {
      if (this.entry.type === 'orgas') {
        return `${this.frontendURL}/project/${this.entry.id}-${slugify.slugifyTitle(this.entry.title)}`
      } else if (this.entry.type === 'events') {
        return `${this.frontendURL}/event/${this.entry.id}-${slugify.slugifyTitle(this.entry.title)}`
      } else if (this.entry.type === 'offers') {
        return `${this.frontendURL}/offer/${this.entry.id}-${slugify.slugifyTitle(this.entry.title)}`
      }
    }
  }
}
</script>
