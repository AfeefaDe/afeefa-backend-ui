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

        <router-link :to="editLink" v-if="editLink" class="editLink inlineEditLink">
          Ändern
        </router-link>

        <a href="" @click.prevent="isEdit = true" v-if="inlineEditing && !isEdit" class="editLink inlineEditLink">
          Ändern
        </a>

        <a href="" @click.prevent="isEdit = false" v-if="inlineEditing && isEdit" class="editLink inlineEditLink">
          Abbrechen
        </a>
      </div>

      <div class="content">
        <slot :isEdit="isEdit" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'icon', 'editLink', 'inlineEditing'],

  data () {
    return {
      isEdit: false
    }
  }
}
</script>

<style lang="scss" scoped>
.entryDetailSection {
  display: flex;
  align-items: center;

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
    text-transform: uppercase;
    color: $gray50;
  }

  .editLink {
    margin-top: -.1em;
    margin-left: .5em;
  }
  .content {
    margin-top: .5em;
  }
}
</style>
