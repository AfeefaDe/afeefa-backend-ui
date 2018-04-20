<template>
  <afeefa-page>
    <entry-header :entry="entry" :isEdit="isEdit" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <slot v-if="entry" />
      <entry-loading-message2 v-else :error="loadingError" :messages="messages" />
    </div>

  </afeefa-page>

</template>

<script>
import EntryLoadingMessage2 from '@/components/entry/EntryLoadingMessage2'

export default {
  props: ['component', 'isEdit'],

  inject: ['$validator'],

  data () {
    return {
      hasItemLoadingError: false
    }
  },

  mounted () {
    console.log(this.$validator)
    console.log(this.component.$validator)
    // this.$validator = this.component.$validator
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
    EntryLoadingMessage2
  }
}
</script>
