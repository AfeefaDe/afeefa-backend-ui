<template>
  <div class="alert-container">
    <transition-group name="alert" tag="div">
    <div v-for="alert in alerts" :key="alert"
      @click="close(alert)" @keydown.esc="close(alert)"
      :class="['alert',
        alert.isError ? 'alert--error' : 'alert--success']">
      <div class="alert__closeIcon"><i class="material-icons">close</i></div>
      <div class="alert__stateIcon">
        <i class="material-icons">{{ alert.isError ? 'error_outline' : 'check' }}</i>
      </div>
      <div class="alert__content">
        <p class="alert__contentTitle">{{ alert.title }}</p>
        <p class="alert__contentDescription">{{ alert.description }}</p>
      </div>
    </div>
    </transition-group>
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
    alerts: state => state.messages.alerts
  }),

  watch: {
    'alerts.length' (alertsLength) {
      if (alertsLength) {
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
    onMouseUp () {
      console.log('dialog mouse')
      this.$store.dispatch('messages/hideAlerts')
    },

    onKeyUp (event) {
      console.log('dialog key')
      if (event.keyCode === 27) {
        this.$store.dispatch('messages/hideAlerts')
      }
    },

    close (alert) {
      this.$store.dispatch('messages/hideAlert', alert)
    }
  }
}

</script>


<style lang="scss">
  .alert-enter-active, .alert-leave-active {
    transition: all .5s;
  }

  .alert-enter, .alert-leave-to {
    opacity: 0;
    transform: translateY(-50px);
  }
</style>
