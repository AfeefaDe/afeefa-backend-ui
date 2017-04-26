<template>
  <li class="detailProperty">
    <span class="detailProperty__propertyIcon">
      <i class="material-icons">{{ iconName }}</i>
    </span>
    <div class="detailProperty__propertyContainer">
      <p class="detailProperty__propertyName">{{ name }}</p>
      <p :class="['detailProperty__propertyContent', {multiline: isMultiline}]">
        <slot>
            Passed down content goes here.
        </slot>
      </p>
    </div>
  </li>
</template>

<script>
export default {
  props: ['name', 'iconName', 'isMultiline']
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/_variables.scss";

.detailProperty {
  display: flex;
  list-style: none;
  margin: 2em 0;
  &__propertyIcon {
    margin-right: 2em;
    .material-icons {
      font-size: 2.3em;
    }
  }
  &__propertyName {
    text-transform: uppercase;
    color: $gray50;
    margin: 0;
  }
  &__propertyContent {
      margin-top: 0.5em;
      margin-bottom: 0;
  }
  .multiline {
      line-height: 175%;
      white-space: normal;
  }
}

</style>
