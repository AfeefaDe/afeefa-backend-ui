<template>
  <li class="detailProperty">
    <div v-if="hasEntryIcon" class="detailProperty__propertyEntryIcon">
      <span :class="['entryType-icon', 'entryType-icon--' + this.entryIconType, 'entryType-icon--' + (entryIconStatus ? 'active' : 'inactive')]"></span>
    </div>

    <span v-else class="detailProperty__propertyIcon">
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
  props: ['name', 'iconName', 'isMultiline', 'hasEntryIcon', 'entryIconType', 'entryIconStatus']
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
    width: 100%;
    max-width: 400px;
  }
  .multiline {
      white-space: pre-wrap;
  }
}

</style>
