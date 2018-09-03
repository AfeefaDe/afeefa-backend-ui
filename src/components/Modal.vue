<template>
  <div>
    <transition name="fade">
      <div class="modal__glassframe" v-if="visible" @click="close"></div>
    </transition>

    <transition name="fade">
      <div v-if="visible" class="modal__window">
        <div class="modal__closeIcon" @click="close">
          <i class="material-icons">cancel</i>
        </div>

        <slot />
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  data () {
    return {
      visible: false
    }
  },

  methods: {
    show () {
      // prevent background scrolling + retain scroll position and vertical scrollbar
      const element = document.documentElement || document.body
      const scroll = element.scrollTop
      // const hasScrollbar = element.scrollHeight > element.clientHeight
      element.style.width = '100%'
      element.style.top = -scroll + 'px'
      element.style.position = 'fixed'
      // element.style.overflowY = hasScrollbar ? 'scroll' : 'hidden'

      this.visible = true
    },

    close () {
      // reset background scrolling + retain scroll position and vertical scrollbar
      const element = document.documentElement || document.body
      const top = element.offsetTop
      element.style.position = 'static'
      element.style.overflowY = ''
      element.scrollTop = -top

      this.visible = false
    }
  }
}
</script>


<style lang="scss" scoped>
  .modal__glassframe {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $z-index-overlay;
    width: 100%;
    height: 100%;
    background-color: black;

    /* stylelint-disable selector-class-pattern */
    &:not(.fade-enter):not(.fade-leave-to) {
      opacity: .3;
    }
  }

  .modal__window {
    position: fixed;
    top: ($header-height*.7);
    left: 50%;
    min-width: 200px;
    z-index: $z-index-overlay + 1;
    background-color: white;
    padding: 20px;
    transform: translateX(-50%);
    // border-radius: 1px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
    color: $black;
  }

  .modal__closeIcon {
    position: absolute;
    cursor: pointer;
    top: 12px;
    right: 12px;
    i {
      font-size: 24px;
      color: $gray30;
      &:hover {
        color: $gray20;
      }
    }
  }
</style>
