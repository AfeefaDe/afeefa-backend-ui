<template>
  <div class="page">
    <div class="row">
      <div class="col s12 m12">
        <div class="mainCard2">
          <slot name="header" />

          <slot name="content" />
        </div>
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
.mainCard2 {
  margin-top: 2em;
  background-color: white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);

  & > * {
    padding: 1.5em;
  }
}
</style>
