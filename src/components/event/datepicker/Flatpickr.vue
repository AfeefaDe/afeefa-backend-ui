<template>
  <input type="text" @input="flatpickerChanges($event.target.value)">
</template>

<script>
import Flatpickr from 'flatpickr'

export default {
  props: ['options'],

  data () {
    return {
      fp: null
    }
  },

  mounted () {
    this.fp = new Flatpickr(this.$el, this.options)
    this.$emit('FlatpickrRef', this.fp)
  },

  destroyed () {
    this.fp.destroy()
    this.fp = null
  },

  methods: {
    flatpickerChanges (value) {
      const date = this.fp.parseDate(value)
      this.$emit('update', date)
    }
  }
}
</script>
