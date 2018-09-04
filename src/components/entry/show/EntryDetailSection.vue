<template>
  <div class="section">
    {{ title}}
    <slot />
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="scss" scoped>
</style>
