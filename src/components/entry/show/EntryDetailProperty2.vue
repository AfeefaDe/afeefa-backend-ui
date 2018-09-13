<template>
  <div class="entryDetailProperty">
    <div class="header">
      <div class="title">{{ title}}</div>

      <div class="editLink" v-if="clickLink">
        <a href="" @click.prevent="$emit('click')" class="inlineEditLink">
          {{ clickLink }}
        </a>
      </div>

      <div class="editLink" v-if="content">
        <a href="" @click.prevent="dispatchEditClick" class="inlineEditLink" ref="trigger">
          {{ content.editLinkTitle }}
        </a>
      </div>

      <div class="editLink" v-if="inlineEditing">
        <a href="" @click.prevent="isEdit = true" v-if="!isEdit" class="inlineEditLink">
          {{ startEditingLink}}
        </a>
        <a href="" @click.prevent="isEdit = false" v-if="isEdit" class="inlineEditLink">
          {{ stopEditingLink }}
        </a>
      </div>
    </div>

    <div class="content">
      <slot :isEdit="isEdit" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'inlineEditing', 'clickLink'],

  inject: ['$validator'],

  data () {
    return {
      content: null,
      isEdit: false,
      startEditingLink: 'Ändern',
      stopEditingLink: 'Ändern'
    }
  },

  created () {
    if (this.inlineEditing && Array.isArray(this.inlineEditing)) {
      this.startEditingLink = this.inlineEditing[0] || this.startEditingLink
      this.stopEditingLink = this.inlineEditing[1] || this.stopEditingLink
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
    p {
      white-space: pre-wrap;
    }
  }
}
</style>
