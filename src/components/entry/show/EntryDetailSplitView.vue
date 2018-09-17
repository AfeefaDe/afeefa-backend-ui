<template>
  <div class="entryDetailSplitView">
    <div class="left">
      <slot name="left" />
    </div>

    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  inject: ['$validator']
}
</script>

<style lang="scss" scoped>
.entryDetailSplitView {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  > * {
    width: 100%;
  }

  &__splitViewChild {
    &.left {
      width: 55%;
      padding-right: 2em;
    }
    &.right {
      width: 45%;
      padding-left: 2em;
      padding-right: 2em;
    }

    @media screen and (max-width: $break-medium) {
      &.left {
        width: 100%;
      }
      &.right {
        width: 100%;
        padding-left: 0;
      }
    }
  }
}

</style>
