<template>
  <div :class="['popUp', {withCloseIcon: closeIcon}]">
    <div class="closeIcon" v-if="closeIcon" @click="close">
      <i class="material-icons">cancel</i>
    </div>
    <slot />
  </div>
</template>


<script>
export default {
  props: ['trigger', 'closeIcon'],

  created () {
    window.addEventListener('click', this.onClickOutside)

    this.$nextTick(() => {
      const popUp = this.$el
      const triggerRect = this.trigger.getBoundingClientRect()
      const diffTrigger = 20
      const marginRight = 20

      popUp.style.left = triggerRect.left - diffTrigger + 'px'
      popUp.style.top = triggerRect.top - diffTrigger + 'px'

      const popUpRect = popUp.getBoundingClientRect()
      if (popUpRect.right > window.innerWidth - marginRight) {
        let diff = popUpRect.right - window.innerWidth + marginRight
        popUp.style.left = triggerRect.left - diffTrigger - diff + 'px'
      }
    })
  },

  destroyed () {
    window.removeEventListener('click', this.onClickOutside)
  },

  methods: {
    onClickOutside (e) {
      if (!this.$el.contains(e.target)) {
        this.close()
      }
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.popUp {
  position: absolute;
  z-index: 2;
  display: block;
  background-color: white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2), 0 2px 10px 0 rgba(0,0,0,0.2);
  padding: .5em;

  &.withCloseIcon {
    padding-right: 3em;
  }
}

.closeIcon {
  position: absolute;
  cursor: pointer;
  top: .5em;
  right: .5em;
  i {
    font-size: 20px;
    color: $gray30;
    &:hover {
      color: $gray20;
    }
  }
}
</style>
