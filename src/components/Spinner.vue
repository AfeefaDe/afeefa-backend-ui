<template>
  <div v-if="show" class="spinner-container"></div>
</template>

<script>
import Spinner from 'spin.js'

export default {
  props: ['show', 'width', 'radius', 'length'],

  mounted () {
    const width = this.width || 3
    const radius = this.radius || 3
    const length = this.length || 3
    let spinner = new Spinner({width, radius, length}).spin()
    this.$el.appendChild(spinner.el)
  }
}
</script>

<style scoped>
.spinner-container {
  position: relative;
  display: inline-block;
  width: 1em;
  sheight: 3em;
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -4px;
}

.spinner {
  margin: 0;
}
</style>
