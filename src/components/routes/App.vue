<template>
  <div id="app">
    <router-view></router-view>

    <spinner-modal></spinner-modal>
    <dialog-window></dialog-window>
    <alert></alert>
  </div>
</template>


<script>
import Alert from '@/components/Alert'
import DialogWindow from '@/components/Dialog'
import SpinnerModal from '@/components/SpinnerModal'

export default {
  components: {
    DialogWindow,
    Alert,
    SpinnerModal
  }
}
</script>
