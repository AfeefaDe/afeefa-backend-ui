<template>
  <div>
    <div @click.prevent.stop="changeDropDownStatus" class="clickable">
      <div class="title">
        <b>{{title}}</b>
        <i v-if="numberOfItems !== 0" :class="['material-icons', {down_arrow: isOpen}]">play_arrow</i>
        <i v-else class="material-icons down_arrow icon-grey">play_arrow</i>
      </div>
      <div class="subtitle">
        <span> {{numberOfItems}} </span>
        {{ $tc('headlines.events', numberOfItems) }}
      </div>
    </div>

    <slot v-if="isOpen && numberOfItems !== 0" >
      Passed down content goes here.
    </slot>
  </div>
</template>

<script>
export default {
  props: ['title', 'numberOfItems', 'isOpened'],

  data () {
    return {
      isOpen: false
    }
  },

  created () {
    this.isOpen = this.isOpened
  },

  methods: {
    changeDropDownStatus () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="scss" scoped>
  div.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  div.subtitle {
    color: grey;
  }
  i.icon-grey {
    color: #ADAEAE;
  }
  .down_arrow {
    -webkit-transform: rotate(90deg);
  }
  .clickable {
    cursor: pointer; cursor: hand;
    border-bottom: none;
  }
</style>
