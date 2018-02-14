<template>
  <div v-if="show" class="spinnerContainer"></div>
</template>

<script>
import Spinner from 'spin.js'

export default {
  props: ['show', 'width', 'radius', 'length', 'color', 'fadeColor'],

  mounted () {
    const width = this.width || 3
    const radius = this.radius || 3
    const length = this.length || 3
    const color = this.color || 'black'
    const fadeColor = this.fadeColor || 0x999
    let spinner = new Spinner({width, radius, length, color, fadeColor}).spin()
    this.$el.appendChild(spinner.el)
  }
}
</script>

<style scoped>
.spinnerContainer {
  position: relative;
  display: inline-block;
  width: 1em;
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -4px;
}
.spinner {
  margin: 0;
}
</style>
