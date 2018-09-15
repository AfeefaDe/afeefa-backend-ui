<template>
  <div class="infoBox">
    <i class="material-icons">error_outline</i>
    <div>
      <slot />
    </div>

  </div>
</template>

<style lang="scss" scoped>
.infoBox {
  font-size: .9em;
  margin-bottom: 2em;

  display: flex;
  align-items: center;
  border: 1px solid $gray20;
  padding: .8em;

  i {
    font-size: 20px;
    margin-right: .6em;
  }

  .removeLink {
    display: block;
    margin-top: .4em;
    font-size: 1em;
  }
}
</style>
