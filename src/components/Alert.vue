<template>
  <div class="alert-container">
    <transition-group name="alert" tag="div">
    <div v-for="alert in alerts" :key="alert.description"
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
      this.$store.dispatch('messages/hideAlerts')
    },

    onKeyUp (event) {
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


<style lang="scss" scoped>
.alert-container {
  position: fixed;
  z-index: $z-index-overlay;
  top: ($header-height*1.1);
  left: 50%;
  transform: translate(-50%, 0);
  width: 90%;
  max-width: 500px;
}

.alert {
  position: relative;
  padding: 1em 1em 1em 0;
  border-radius: 4px;
  background: $black;
  color: $white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  align-items: center;
  display: flex;
  outline: 0;
  margin-bottom: 3px;
  &__closeIcon {
    position: absolute;
    cursor: pointer;
    top: 5px;
    right: 5px;
    i {
      font-size: 30px;
    }
  }
  &__stateIcon {
    padding: 0 1.5em;
    line-height: 100%;
    i {
      font-size: 50px;
    }
  }
  &__content {
    font-size: 1.2rem;
  }
  &__contentTitle {
    font-weight: 500;
    margin: 0;
  }
  &__contentDescription {
    margin: 0.3em 0 0 0;
    font-size: 0.9em;
    font-weight: 300;
    white-space: pre-wrap;
  }
}
$alert-border-width: 7px;

.alert--error {
  border-left: $alert-border-width solid $red;
}

.alert--success {
  border-left: $alert-border-width solid $green;
}

.alert-enter-active, .alert-leave-active {
  transition: all .4s;
}
.alert-enter, .alert-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

</style>
