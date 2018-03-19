<template>
  <div class="facetItemTag" :style="color ? {backgroundColor: color} : ''">
    <span class="title" :style="hasDarkBackground() ? {color: 'white'} : ''">
      {{ facetItem.title || 'Kein Titel' }}
    </span>
  </div>
</template>


<script>
export default {
  props: ['facetItem'],

  data () {
    return {
      color: null
    }
  },

  created () {
    this.setColor()
  },

  watch: {
    // parent comes late
    'facetItem.parent' () {
      this.setColor()
    },

    // parent color may change
    'facetItem.parent.color' () {
      this.setColor()
    },

    // color may change
    'facetItem.color' () {
      this.setColor()
    }
  },

  methods: {
    setColor () {
      this.color = this.facetItem.color
      if (this.facetItem.parent) {
        this.color = this.facetItem.parent.color
      }
    },

    hasDarkBackground () {
      if (!this.color) {
        return false
      }
      return this.getBrightness(this.color) < 120
    },

    getBrightness (color) {
      const hexCode = color.replace('#', '')
      const r = parseInt(hexCode.substr(0, 2), 16)
      const g = parseInt(hexCode.substr(2, 2), 16)
      const b = parseInt(hexCode.substr(4, 2), 16)
      return (r * 299 + g * 587 + b * 114) / 1000
    }
  }
}
</script>


<style lang="scss" scoped>
.facetItemTag {
  border-radius: .1em;
  background-color: $gray30;
  display: inline-block;
  color: $black;
  padding: 0 0.4em;
}
</style>
