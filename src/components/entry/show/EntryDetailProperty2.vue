<template>
  <div class="entryDetailProperty">
    <div class="header">
      <div class="title">{{ title}}</div>

      <div class="editLink" v-if="content">
        <a href="" @click.prevent="dispatchEditClick" class="inlineEditLink" ref="trigger">
          {{ content.editLinkTitle }}
        </a>
      </div>
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],

  data () {
    return {
      content: null
    }
  },

  mounted () {
    this.$children.forEach(vue => {
      if (!this.content && vue.isEntryDetailSectionContent) {
        this.content = vue
      }
    })
  },

  methods: {
    dispatchEditClick (trigger) {
      if (this.content) {
        this.content.editLinkClick(this.$refs.trigger)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.entryDetailProperty {
  position: relative;
  .header {
    display: flex;
    align-items: center;
  }

  .title {
    color: $gray50;
  }

  .editLink {
    position: relative;
    top: -2px;
    left: .6em;
  }

  .content {
    margin-top: .3em;
  }
}
</style>
