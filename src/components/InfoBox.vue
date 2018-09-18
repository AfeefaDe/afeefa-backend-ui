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
  border: 1px solid $gray10;
  padding: .4em;
  box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.05);

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
