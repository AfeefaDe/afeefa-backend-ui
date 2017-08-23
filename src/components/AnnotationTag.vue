<template>
  <p
  v-bind:class="['annotationTag', annotation.annotationCategory.generatedBySystem ? 'annotationTag--system' : '', editMode ? 'annotationTag--editMode' : '']" :title= "$t('hints.edit_annotations')">
    <span>
      {{annotation.annotationCategory.title}}
        <input v-if="editMode && !annotation.annotationCategory.generatedBySystem" class="annotationTag__detailInput" type="text" placeholder="Please enter Detail information" :value="annotation.detail" v-model="annotation.detail">
        <span v-else class="annotation-detail"><br>{{annotation.detail}}</span>
    </span>
    <a v-if="editMode" href="" @click.prevent="removeAnnotation(annotation)" class="annotationTag__icon">
      <i class="material-icons">close</i>
    </a>
  </p>
</template>


<script>
export default {
  props: ['annotation', 'editMode'],
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
    background: $white;
    border-radius: 2px;
    border-left: 5px solid $annotationUserColor;
    max-width: 100%;
    line-height: 140%;
    word-break: break-word;
    padding: 0.4em 0.5em 0.3em 0.5em;
    margin: .2em 1em 0.4em 0;
    display: inline-block;
    vertical-align: top;
    span.annotation-detail {
      color: grey;
      font-size: 12px;
    }
    &__detailInput {
      margin-bottom: 0;
      background: darken($secondaryBlue, 20);
      border: 0;
      padding-left: 0.5em;
      padding-top: 0.5em;
      line-height: 100%;
      margin-top: 10px;
      font-size: 0.8rem;
      height: auto;
      padding-bottom: 0.5em;
    }
    &__detailInput:focus {
      border: 0;
      box-shadow: none;
    }
    &--editMode {
      background: $annotationUserColor;
      color: #fff;
      margin: 0.4em 0.3em;
      padding: 0.5em 0.8em;
      border-left-width: 0;
      /*remove border*/
      display: flex;
      height: 100%;
      span.annotation-detail {
        color: white;
      }
      a {
        color: inherit
      }
      &__icon {
        margin-left: 0.5em;
        cursor: pointer;
      }
      &__icon i {
        font-size: 1.3em;
        vertical-align: sub;
      }
    }
}
$annotationSystemColor: $gray90;
.annotationTag--system {
  border-left-color: $annotationSystemColor;
}
.annotationTag--system.annotationTag--editMode {
  background: $annotationSystemColor;
}




</style>
