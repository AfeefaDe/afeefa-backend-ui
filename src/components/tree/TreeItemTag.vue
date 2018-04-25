<template>
  <div class="treeItemTag"
    :style="{borderColor: (color ? color : '')}">
    <span class="title">
      <router-link v-if="link" :to="link">
        {{ treeItem.title || 'Kein Titel' }} <span class="count" v-if="hasCount">({{ currentCountOwners }})</span>
      </router-link>
      <span v-else>
        {{ treeItem.title || 'Kein Titel' }} <span class="count" v-if="hasCount">({{ currentCountOwners }})</span>
      </span>
    </span>
    <i class="material-icons" :style="{coslor: (color ? color : '')}" v-if="x">cancel</i>
  </div>
</template>


<script>
export default {
  props: ['treeItem', 'countOwners', 'x', 'link', 'count'],

  data () {
    return {
      color: null,
      hasCount: this.count === undefined ? true : this.count
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

  computed: {
    currentCountOwners () {
      return this.countOwners !== undefined ? this.countOwners : this.treeItem.count_owners
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
    }
  }
}
</script>


<style lang="scss" scoped>
.treeItemTag {
  @include user-select();

  border-left: 5px solid black;

  border-radius: .2em;
  background-color: $white;
  display: inline-block;
  color: $black;
  padding: 0.4em 0.5em;
  line-height: 1em;
  font-size: .9em;
}

a {
  color: inherit;
  position: relative;
  top: .05em;
}

i {
  display: inline;
  position: relative;
  top: 3px;
  font-size: 1.1em;
  line-height: 0;
  margin-left: 3px;
  color: $gray80;
}

.count {
  font-size: .8em;
  margin-left: .3em;
}
</style>
