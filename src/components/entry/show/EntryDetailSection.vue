<template>
  <div class="entryDetailSection">
    <div class="left">
      <div v-if="icon" class="icon">
        <i class="material-icons">{{ icon }}</i>
      </div>
    </div>

    <div class="right">
      <div class="header">
        <div class="title">{{ title}}</div>

        <div class="editLink" v-if="editLink">
          <router-link :to="editLink" class="inlineEditLink">
            Ändern
          </router-link>
        </div>

        <div class="editLink" v-if="dispatchEdit">
          <a href="" @click.prevent="dispatchEditClick" class="inlineEditLink">
            Ändern
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

      <div class="content">
        <slot :isEdit="isEdit" ref="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'icon', 'editLink', 'inlineEditing', 'dispatchEdit'],

  data () {
    return {
      isEdit: false
    }
  },

  methods: {
    dispatchEditClick () {
      this.$children.forEach(vue => {
        vue.editLinkClick(this.$refs.trigger)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.entryDetailSection {
  display: flex;
  align-items: top;

  .left {
    flex: 0 0 60px;
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
  }

  .title {
    font-size: 1.2em;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: $gray50;
  }

  .editLink {
    margin-top: -.3em;
    margin-left: .4em;
  }

  .content {
    margin-top: 1em;
  }
}
</style>
