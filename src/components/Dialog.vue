<template>
  <div class="dialogContainer">
    <div :class="['dialogGlassframe', dialog ? 'dialogGlassframe--visible' : 'dialogGlassframe--invisible']"></div>

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


<style lang="scss" scoped>
.dialogContainer {
  position: absolute;
  top: 0;
  left: 0;
}

.dialogGlassframe {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: black;
  transition: opacity .1s ease;

  &--visible {
    opacity: .4;
  }
  &--invisible {
    opacity: 0;
    height: 0;
    overflow: hidden;
  }
}

.dialog {
  $dialogPaddingTop: 20px;
  position: fixed;
  z-index: $z-index-overlay;
  left: 50%;
  top: ($header-height*1.1);
  transform: translate(-50%, 0);
  width: 90%;
  max-width: 500px;
  border-radius: 4px;
  background: $black;
  color: $white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  outline: 0;
  &__closeIcon {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
    i {
      font-size: 30px;
    }
  }
  &__content {
    width: 100%;
    font-size: 1.2rem;
    padding: $dialogPaddingTop 1.5em 1em;
  }
  &__contentTitle {
    font-weight: 500;
    margin: 0;
  }
  &__contentMessage {
    margin: 1.5em 0 0 0;
    font-size: 0.9em;
    font-weight: 300;
    white-space: pre-wrap;
  }
  &__contentActions {
    width: 100%;
    display: flex;
    margin: 0;
  }
  &__action {
    text-align: center;
    padding: 0.8em 0;
    margin-top: 1.3em;
    flex-grow: 2;
    cursor: pointer;
    font-size: 1.1rem;
    background: lighten($black, 10%);
    border-right: solid 2px $black;
    &:last-child {
      border-right-style: none;
    }
    &:hover {
      background: lighten($black, 15%);
    }
    &--no {
      color: $white;
    }
  }
}
</style>
