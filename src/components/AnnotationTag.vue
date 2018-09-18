<template>
  <div :class="['annotationTag', {generatedBySystem, selected}]" @click="$emit('click')">
    <i class="material-icons">assignment</i>
    {{ title }}
  </div>
</template>


<script>
export default {
  props: ['annotation', 'selected'],

  computed: {
    generatedBySystem () {
      const category = this.annotation.annotationCategory
      return (category && category.generatedBySystem) || false
    },
    title () {
      const category = this.annotation.annotationCategory
      return (category && category.title) || ''
    }
  }
}
</script>


<style lang="scss" scoped>
.annotationTag {
  cursor: pointer;
  @include user-select();
  display: inline-flex;
  align-items: center;
  font-weight: normal;
  background-color: $white;
  padding: .3em .6em;
  border-radius: .3em;

  &.selected {
    border: 1px solid $gray30;
    background-color: white;
  }

  i {
    font-size: 1.2em;
    margin-right: .4em;
    color: $red_bright;
  }

  &.generatedBySystem i {
    color: $gray90;
  }
}
</style>
