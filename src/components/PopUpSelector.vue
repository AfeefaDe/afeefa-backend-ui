<template>
  <transition name="popup">
    <div :class="['popUp', {withCloseIcon: closeIcon, fixed: position === 'fixed'}]">
      <div class="closeIcon" v-if="closeIcon" @click="close">
        <i class="material-icons">cancel</i>
      </div>
      <slot :popUp="instance" />
    </div>
  </transition>
</template>


<script>
export default {
  props: ['trigger', 'closeIcon', 'align', 'diffX', 'diffY', 'marginRight', 'position'],

  created () {
    window.addEventListener('click', this.onClickOutside)
  },

  mounted () {
    document.body.appendChild(this.$el)
    this.repositionLater()
  },

  destroyed () {
    window.removeEventListener('click', this.onClickOutside)
    // remove after fade out transition completess
    setTimeout(() => {
      if (document.body.contains(this.$el)) {
        document.body.removeChild(this.$el)
      }
    }, 100)
  },

  computed: {
    instance () {
      return this
    }
  },

  methods: {
    onClickOutside (e) {
      if (!this.$el.contains(e.target)) {
        this.close()
      }
    },

    repositionLater () {
      setTimeout(() => {
        this.reposition()
      })
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

      let popUpRect = popUp.getBoundingClientRect()

      let left
      if (this.align === 'left') {
        left = triggerRight - popUpRect.width + diffTriggerX
      } else {
        left = triggerLeft - diffTriggerX
      }

      const popUpRight = left + popUpRect.width
      if (popUpRight > window.innerWidth - marginRight) {
        let diff = popUpRight - window.innerWidth + marginRight
        left -= diff
      }

      let top = triggerTop - diffTriggerY
      const popUpBottom = top + popUpRect.height
      if (popUpBottom > (window.scrollY + window.innerHeight - marginRight)) {
        let diff = popUpBottom - window.scrollY - window.innerHeight + marginRight
        top = triggerTop - diffTriggerY - diff
      }

      popUp.style.left = left + 'px'
      popUp.style.top = top + 'px'
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

  &.fixed {
    position: fixed;
  }
  z-index: $z-index-overlay;
  display: block;
  background-color: white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2), 0 2px 10px 0 rgba(0,0,0,0.2);
  padding: .5em;
  transition: left .2s;

  &.withCloseIcon {
    padding-right: 2em;
  }
}

/* stylelint-disable selector-class-pattern */
.popup-enter, .popup-leave-to {
  opacity: 0;
}
.popup-enter-active, .popup-leave-active {
  transition: all .1s;
}
/* stylelint-enable */

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
