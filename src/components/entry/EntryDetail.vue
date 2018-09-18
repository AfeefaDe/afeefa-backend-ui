<template>
  <afeefa-page>
    <entry-header :entry="entry" :isEdit="isEdit" :routeConfig="routeConfig" slot="header">
      <slot name="headerButtons" slot="buttons" />
      <div slot="secondaryButtons" class="secondaryButtons">
        <slot name="secondaryHeaderButtons" />
      </div>
    </entry-header>

    <div slot="content">
      <slot v-if="entry" />

      <entry-loading-message v-else :error="loadingError" :messages="messages" />
    </div>

  </afeefa-page>

</template>

<script>
export default {
  props: ['component', 'isEdit'],

  inject: ['$validator'],

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
  }
}
</script>

<style lang="scss" scoped>
.secondaryButtons {
  display: flex;
  > *:last-child {
    margin-left: .4em;
  }
}
</style>
