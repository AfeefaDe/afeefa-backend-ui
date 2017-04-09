<template>
  <div v-if="show" class="spinner-container"></div>
</template>

<script>
import Spinner from 'spin.js'

export default {
  props: ['show', 'width', 'radius', 'length'],

  mounted () {
    let spinner = new Spinner({
      width: this.width || 3,
      radius: this.radius || 15,
      length: this.length || 8
    }).spin()
    this.$el.appendChild(spinner.el)
  }
}
</script>

<style scoped>
.spinner-container {
  position: relative;
  smargin: 20px 5px 10px 0;
  sheight: 40px;
}

.spinner {
  margin: 0;
}
</style>
