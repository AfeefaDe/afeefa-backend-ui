<template>
  <div :class="['treeItemTag', {selected, clickable: hasClickListener, withChevron: chevron}]"
    :style="{borderColor: (color ? color : '')}"
    @click="onClick">
    <div class="content">
      <div class="chevron" v-if="chevron" :style="{color}"></div>

      <span class="tagName">{{ treeItem.title || 'Kein Titel' }}</span>

      <div class="more" v-if="more"></div>

      <i class="material-icons" v-if="x">cancel</i>
    </div>
  </div>
</template>


<script>
export default {
  props: ['treeItem', 'chevron', 'x', 'click', 'selected', 'link', 'more'],

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
    hasClickListener () {
      if (this.click === false) {
        return false
      }
      return this.$listeners && this.$listeners.click
    }
  },

  methods: {
    onClick () {
      if (this.hasClickListener) {
        this.$emit('click', this.treeItem)
      }
    },

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

  border-radius: .2em;
  background-color: $white;
  display: inline-block;
  color: $black;
  padding: 0 0.5em;
  line-height: 1.2em;
  font-size: .9em;
  position: relative;
  height: 1.8em;
  white-space: nowrap;
  // max-width: calc(100% - 3em);

  &.clickable {
    cursor: pointer;
    &:hover {
      background-color: darken($white, 3);
      i {
        color: $gray90;
      }
    }
  }

  &.selected, &.selected:hover {
    background-color: darken($white, 10);
  }

  &:not(.withChevron) {
    border-left: 5px solid;
  }

  &.withChevron {
    background-color: $gray10;
    padding-left: .3em;
    border-radius: 0;

    + .withChevron {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      &:before {
        display: inline-block;
        content: '';
        position: absolute;
        top: 0;
        left: -.4em;
        border-top: .9em solid $gray10;
        border-bottom: .9em solid $gray10;
        border-left: .4em solid transparent;
        width: .4em;
        height: 1.8em;
      }
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: -.4em;
      border-top: .9em solid transparent;
      border-bottom: .9em solid transparent;
      border-left: .4em solid $gray10;
      width: .4em;
      height: 1.8em;
    }
  }

  &.withChevron.clickable {
    &:hover {
      background-color: darken($gray10, 3);

      &:before {
        border-top-color: darken($gray10, 3);
        border-bottom-color: darken($gray10, 3);
      }
      &:after {
        border-left-color: darken($gray10, 3);
      }
    }

    &.selected, &.selected:hover {
      &:before {
        border-top-color: darken($gray10, 10);
        border-bottom-color: darken($gray10, 10);
      }
      &:after {
        border-left-color: darken($gray10, 10);
      }
    }
  }
}

.content {
  display: flex;
  align-items: center;
  height: 100%;
}

.tagName {
  text-overflow: ellipsis;
  overflow: hidden;
}

a {
  color: inherit;
  position: relative;
  top: .05em;
}

i {
  font-size: 1.1em;
  margin-left: .4em;
  color: $gray80;
}

.count {
  margin-top: 2px;
  font-size: .8em;
  margin-left: .4em;
  color: $gray50;

  .more + & {
    margin-left: 0;
  }
}

// https://codepen.io/jonneal/pen/kptBs/
.chevron {
  margin-right: .5em;
}

.chevron:before {
  content: '';
  border-style: solid;
  border-width: 0.25em 0.25em 0 0;
  display: inline-block;
  width: .7em;
  height: .7em;
  position: relative;
  // left: .1em;
  top: -.05em;
  transform: rotate(45deg) scale(.8);
  // vertical-align: top;
}

.more {
  margin-left: .4em;
}

.more:before {
  content: '';
  border-style: solid;
  border-color: $gray50;
  border-width: 0.25em 0.25em 0 0;
  display: inline-block;
  width: .7em;
  height: .7em;
  position: relative;
  left: -.3em;
  top: 0;
  transform: rotate(45deg) scale(.6);
  // vertical-align: top;
}
</style>
