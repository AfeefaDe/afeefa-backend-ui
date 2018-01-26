<template>
  <li class="detailProperty">
    <span v-if="iconName" class="detailProperty__propertyIcon">
      <i class="material-icons">{{ iconName }}</i>
    </span>

    <span v-else class="detailProperty__propertyEntryIcon">
      <slot name="icon" />
    </span>

    <div class="detailProperty__propertyContainer">
      <p class="detailProperty__propertyName">{{ name }}</p>
      <p :class="['detailProperty__propertyContent', {multiline: isMultiline}]">
        <slot />
      </p>
    </div>
  </li>
</template>

<script>
export default {
  props: ['name', 'iconName', 'isMultiline', 'entryIconType', 'entryIconStatus', 'entryIconClass']
}
</script>

<style lang="scss" scoped>
@import "~variables";

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
  &__propertyEntryIcon {
    margin-left: 0.3em;
    margin-right: 2em;
    margin-top: 0.3em;
    padding-right: 0.3em;
    line-height: 100%;
    span {
      width: 24px;
      height: 24px;
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
      line-height: 160%;
      white-space: normal;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
  }
  &__propertyContainer {
    width: 80%;
  }
  .multiline * { /* ignore v-if=false comments that force empty lines */
      white-space: pre-wrap;
  }
}

</style>
