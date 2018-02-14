<template>
  <div :class="['mainCard__header', 'mainCard__headerCategories', categoryClass]">
    <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>

    <div class="mainCard__headerTitle">
      <span class="mainCard__type" v-if="entry.type === 'orgas'">{{$t('orgaTypes.'+entry.orga_type_id+'.name')}}</span>
      <h2 class="mainCard__headerTitleHeading">{{ entry.title || 'Kein Titel' }}</h2>
      <span v-if="entry.parent_orga" class="mainCard__headerSubtitle">
        <router-link :to="{name: entry.parent_orga.type + '.show', params: {id: entry.parent_orga.id}}">
          <u> {{ entry.parent_orga.title }}</u>
        </router-link>
      </span>
    </div>

    <div class="mainCard__headerButtonContainer">
      <a v-if="entryVisibleInFrontend" :href="previewLink" target="_blank" class="mainCard__headerButton">
        {{$t('headlines.preview')}}
        <i class="material-icons">link</i>
      </a>

      <a class="mainCard__headerButton" @click="togglePublishState">
        {{ entry.active ? $t('buttons.deactivate') : $t('buttons.activate') }}
        <i class="material-icons"><template v-if="entry.active">visibility</template><template v-else>visibility_off</template></i>
      </a>

      <router-link :to="{name: routeName + '.edit', params: {id: entry.id}, query:{tab: currentTab}}" class="mainCard__headerButton">
        {{$t('buttons.edit')}}
        <i class="material-icons">mode_edit</i>
      </router-link>
    </div>

  </div>
</template>

<script>
import slugify from '@/helpers/slugify'
import GenerateFrontendLinkMixin from '@/components/mixins/GenerateFrontendLinkMixin'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [GenerateFrontendLinkMixin, RouteConfigAwareMixin],

  props: ['entry', 'currentTab'],

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
          this.currentlyPublishing = true
          const attributes = {
            active: !this.entry.active
          }
          this.Resource.updateAttributes(this.entry, attributes).then(attributes => {
            this.currentlyPublishing = false
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
      }
    },

    categoryClass () {
      if (this.entry.category && this.entry.category.title) {
        return 'cat-' + this.entry.category.title
      }
    }
  }
}
</script>
