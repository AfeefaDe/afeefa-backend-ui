<template>
  <div :class="['outherContainer', {lastItem: isLast}]">
    <div class="innerContainer">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['isLast']
}
</script>


<style lang="scss" scoped>
.outherContainer {
  position: relative;
  left: 8px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    width: 0;
    height: 100%;
    border-left: 1px solid $gray30;
  }
}

.innerContainer {
  &:before {
    content: "";
    position: absolute;
    top: 11px;
    width: 1px;
    padding-left: 12px;
    border-top: 1px solid $gray30;
  }
}

.innerContainer > * {
  margin-left: 14px;
}

.lastItem {
  padding-top: 0;
  margin-bottom: 5px;

  &:before {
    height: 12px;
  }
}
</style>
