<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <slot name="header" />

        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['$validator']
}
</script>


<style lang="scss" scoped>
.mainCard {
  // border-top: 30px solid $gray50;
}

</style>
