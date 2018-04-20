<template>
  <afeefa-page v-if="entry">
    <entry-header :entry="entry" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <slot />
    </div>

  </afeefa-page>

  <entry-loading-message v-else :error="loadingError" :messages="messages" />
</template>

<script>
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'

export default {
  props: ['component'],

  data () {
    return {
      hasItemLoadingError: false
    }
  },

  computed: {
    routeConfig () {
      return this.component.routeConfig
    },

    loadingError () {
      return this.component.loadingError
    },

    entry () {
      return this.component.item
    },

    messages () {
      return this.component.routeConfig.messages
    }
  },

  components: {
    EntryLoadingMessage
  }
}
</script>
