<template>
  <div class="treeItemTag" :style="color ? {backgroundColor: color} : ''">
    <span class="title" :style="hasDarkBackground() ? {color: 'white'} : ''">
      <router-link v-if="link" :to="link">
        {{ treeItem.title || 'Kein Titel' }} <span class="count">({{ treeItem.count_owners }})</span>
      </router-link>
      <span v-else>
        {{ treeItem.title || 'Kein Titel' }} <span class="count">({{ treeItem.count_owners }})</span>
      </span>
    </span>
  </div>
</template>


<script>
export default {
  props: ['treeItem', 'link'],

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
    'treeItem.parent' () {
      this.setColor()
    },

    // parent color may change
    'treeItem.parent.previewColor' () {
      this.setColor()
    },

    // container color may change
    'treeItem.container.previewColor' () {
      this.setColor()
    },

    // color may change
    'treeItem.color' () {
      this.setColor()
    }
  },

  methods: {
    setColor () {
      this.color = null

      if (this.treeItem.container) { // may be fetched later
        this.color = this.treeItem.container.previewColor || this.treeItem.container.color
      }

      if (this.treeItem.parent) { // may be fetched later
        this.color = this.treeItem.parent.previewColor || this.treeItem.parent.color || this.color
      } else {
        this.color = this.treeItem.color || this.color
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
.treeItemTag {
  border-radius: .2em;
  background-color: $gray30;
  display: inline-block;
  color: $black;
  padding: 0.3em 0.5em;
  line-height: 1em;
  font-size: .9em;
}

a {
  color: inherit;
}

.count {
  font-size: .8em;
  margin-left: .3em;
}
</style>
