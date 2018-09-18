<template>
  <div :class="['entryDetailSection', {pullLeft}]">
    <div class="left" v-if="icon">
      <div v-if="icon" class="icon">
        <i class="material-icons">{{ icon }}</i>
      </div>
    </div>

    <div class="right">
      <div class="header" v-if="title">
        <div class="title">{{ title }}</div>

        <div class="editLink" v-if="editLink">
          <router-link :to="editLink" class="inlineEditLink">
            Ändern
          </router-link>
        </div>

        <div class="editLink" v-if="content">
          <a href="" @click.prevent="dispatchEditClick" class="inlineEditLink">
            {{ content.editLinkTitle }}
          </a>
        </div>

        <div class="editLink" v-if="clickLink">
          <a href="" @click.prevent="$emit('click')" class="inlineEditLink">
            {{ clickLink }}
          </a>
        </div>

        <div class="editLink" v-if="inlineEditing">
          <a href="" @click.prevent="isEdit = true" v-if="!isEdit" class="inlineEditLink">
            Ändern
          </a>
          <a href="" @click.prevent="isEdit = false" v-if="isEdit" class="inlineEditLink">
            Abbrechen
          </a>
        </div>

      </div>

      <div :class="['content', {pullLeft}]">
        <slot :isEdit="isEdit" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'icon', 'pullLeft', 'editLink', 'inlineEditing', 'dispatchEdit', 'clickLink'],

  inject: ['$validator'],

  data () {
    return {
      content: null,
      isEdit: false
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
    dispatchEditClick () {
      this.$children.forEach(vue => {
        if (vue.isEntryDetailSectionContent) {
          vue.editLinkClick(this.$refs.trigger)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.entryDetailSection {
  display: flex;
  align-items: top;

  &.pullLseft {
    display: block;
    > * {
      display: block;
      width: 100%;
      // .header {
      //   justify-content: center;
      // }
      .icon {
        // text-align: center;
        margin-bottom: 2em;
        margin-left: 2em;
      }
      .icon i {
        font-size: 40px;
      }
    }
  }

  .left {
    flex: 0 0 3.5em;
  }

  .right {
    flex-grow: 1;
  }

  .icon i {
    font-size: 26px;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: .5em;
  }

  .title {
    font-size: 1.3em;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: $gray50;
  }

  .editLink {
    margin-top: -.3em;
    margin-left: .4em;
  }

  .content {
    &.pullLeft {
      // margin-left: -3.5em;
    }
    p {
      white-space: pre-wrap;
    }
  }
}
</style>
