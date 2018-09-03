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
  props: ['trigger', 'closeIcon', 'align', 'diffX', 'diffY', 'marginRight'],

  created () {
    window.addEventListener('click', this.onClickOutside)

    this.$nextTick(() => {
      document.body.appendChild(this.$el)
      this.reposition()
    })
  },

  destroyed () {
    window.removeEventListener('click', this.onClickOutside)
    if (document.body.contains(this.$el)) {
      document.body.removeChild(this.$el)
    }
  },

  methods: {
    onClickOutside (e) {
      if (!this.$el.contains(e.target)) {
        this.close()
      }
    },

    reposition () {
      const popUp = this.$el

      const triggerRect = this.trigger.getBoundingClientRect()
      const triggerLeft = window.scrollX + triggerRect.left // this.trigger.offsetLeft
      const triggerTop = window.scrollY + triggerRect.top // this.trigger.offsetTop
      const triggerRight = triggerLeft + triggerRect.width

      const diffTriggerX = this.diffX !== undefined ? this.diffX : 20
      const diffTriggerY = this.diffY !== undefined ? this.diffY : 20
      const marginRight = this.marginRight !== undefined ? this.marginRight : 20

      let popUpRect

      if (this.align === 'left') {
        popUpRect = popUp.getBoundingClientRect()
        popUp.style.left = triggerRight - popUpRect.width + diffTriggerX + 'px'
      } else {
        popUp.style.left = triggerLeft - diffTriggerX + 'px'
      }
      popUp.style.top = triggerTop - diffTriggerY + 'px'

      popUpRect = popUp.getBoundingClientRect()
      if (popUpRect.right > window.innerWidth - marginRight) {
        let diff = popUpRect.right - window.innerWidth + marginRight
        popUp.style.left = triggerLeft - diffTriggerX - diff + 'px'
      }
      if (popUpRect.bottom > window.innerHeight - marginRight) {
        let diff = popUpRect.bottom - window.innerHeight + marginRight
        popUp.style.top = triggerTop - diffTriggerY - diff + 'px'
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
  z-index: $z-index-overlay;
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
