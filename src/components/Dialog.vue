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
  computed: mapState({
    dialog: state => state.messages.dialog
  }),

  created () {
    window.addEventListener('keyup', event => {
      if (this.dialog && event.keyCode === 27) {
        this.dialog.cancel()
      }
    })
    window.addEventListener('mouseup', event => {
      if (this.dialog) {
        const dialogDom = this.$el.querySelector('.dialog')
        if (!dialogDom.contains(event.target)) {
          this.dialog.cancel()
        }
      }
    })
  },

  methods: {
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
