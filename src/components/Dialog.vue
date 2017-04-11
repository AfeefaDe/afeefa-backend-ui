<template>
  <div class="dialog-container">
    <div :class="['dialog-glassframe', dialog ? 'dialog-glassframe--visible' : 'dialog-glassframe--invisible']"></div>

    <transition name="dialog">
      <div class="dialog" v-if="dialog">
        <div class="dialog__closeIcon" @click="close('cancel')">
          <i class="material-icons">close</i>
        </div>
        <div class="dialog__content">
          <p class="dialog__contentTitle">{{ dialog.title }}</p>
          <p class="dialog__contentMessage">{{ dialog.message }}</p>
        </div>
        <p class="dialog__contentActions">
          <a @click.prevent="close('no')" class="dialog__action dialog__action--no">{{ dialog.noButton }}</a>
          <a @click.prevent="close('yes')" class="dialog__action dialog__action--yes">{{ dialog.yesButton }}</a>
        </p>
      </div>
    </transition>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      hasCancelListeners: false
    }
  },

  computed: mapState({
    dialog: state => state.messages.dialog
  }),

  watch: {
    dialog (dialog) {
      if (dialog) {
        if (!this.hasCancelListeners) {
          window.addEventListener('keyup', this.onKeyUp)
          window.addEventListener('mouseup', this.onMouseUp)
          this.hasCancelListeners = true
        }
      } else {
        window.removeEventListener('keyup', this.onKeyUp)
        window.removeEventListener('mouseup', this.onMouseUp)
        this.hasCancelListeners = false
      }
    }
  },

  methods: {
    onMouseUp (event) {
      const dialogDom = this.$el.querySelector('.dialog')
      if (!dialogDom.contains(event.target)) {
        this.dialog.cancel()
      }
    },

    onKeyUp (event) {
      if (event.keyCode === 27) {
        this.dialog.cancel()
      }
    },

    close (reason) {
      if (this.dialog) {
        this.dialog[reason]()
      }
    }
  }
}
</script>


<style>
.dialog-enter-active, .dialog-leave-active {
  transition: all .2s;
}
.dialog-enter, .dialog-leave-to {
  opacity: 0;
  top: 0px;
}
</style>
