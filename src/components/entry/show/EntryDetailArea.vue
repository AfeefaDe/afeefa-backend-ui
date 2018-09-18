<template>
  <div class="entryDetailArea">
    <slot />
  </div>
</template>

<script>
export default {
  inject: ['$validator']
}
</script>

<style lang="scss" scoped>
.entryDetailArea {
  margin-top: 1em;
  & + & {
    margin-top: 3em;
  }
  margin-bottom: 2em;
}

</style>
