<template>
  <div :class="[
    'annotationTag', generatedBySystem ? 'annotationTag--system' : '',
    editMode ? 'annotationTag--editMode' : '']"
    :title= "$t('hints.edit_annotations')">
    <div class="annotationTag__header">
      <span>
        {{ title }}
      </span>
      <a v-if="editMode" href="" @click.prevent="removeAnnotation(annotation)" class="annotationTag__icon">
        <i class="material-icons">close</i>
      </a>
    </div>
    <div class="annotationTag__body">
        <textarea v-if="editMode && !generatedBySystem"
          class="annotationTag__detailInput"
          type="text"
          :placeholder="$t('hints.annotation_detail')"
          v-model="annotation.detail"></textarea>
        <span v-else class="annotation-detail">{{ annotation.detail }}</span>
    </div>
  </div>
</template>


<script>
export default {
  props: ['annotation', 'editMode'],

  computed: {
    generatedBySystem () {
      // category fetched with delay
      const category = this.annotation.annotationCategory
      return (category && category.generatedBySystem) || false
    },
    title () {
      // category fetched with delay
      const category = this.annotation.annotationCategory
      return (category && category.title) || ''
    }
  },

  methods: {
    removeAnnotation: function (annotation) {
      this.$emit('remove', annotation)
    }
  }
}
</script>


<style lang="scss" scoped>
@import "~variables";

$annotationUserColor: $secondaryBlue;
.annotationTag {
    display: inline-block;
    background: $white;
    border-radius: 2px;
    border-left: 5px solid $annotationUserColor;
    max-width: 100%;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
    line-height: 140%;
    word-break: break-word;
    padding: 0.4em;
    margin: 0.5em 1em 0.5em 0;
    vertical-align: top;
    span.annotation-detail {
      color: grey;
      font-size: 12px;
      white-space: pre-line;
    }
    &__detailInput {
      $backgroundColor: white;
      display: block;
      outline: 0;
      background: $backgroundColor;
      color: $black;
      border: 0;
      &::placeholder {
        color: lighten($black, 20);
      }
      border: 1px solid $backgroundColor;
      transition: border-color 0.5s ease;
      &:focus {
        border-color: $annotationUserColor!important;
        box-shadow: none;
      }
      line-height: 110%;
      font-size: 0.85rem;
      padding: 0.7em;
      margin-top: 10px;
      height: auto;
      min-height: 60px;
      width: 100%;
    }

    &__header {
      display: flex;
      justify-content: space-between;
    }
    &__body {
      width: 100%;
    }
    &__icon {
      margin-left: 0.5em;
      cursor: pointer;
      i {
        font-size: 1.2em;
        vertical-align: sub;
      }
    }
    &--editMode {
      a {
        color: inherit
      }
    }
}
$annotationSystemColor: $gray90;
.annotationTag--system {
  border-left-color: $annotationSystemColor;
}
</style>
