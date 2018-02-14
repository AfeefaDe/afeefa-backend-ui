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

import 'flatpickr/dist/themes/material_green.css'
import 'leaflet/dist/leaflet.css'
import '@/assets/styles/app.scss'


export default {
  components: {
    DialogWindow,
    Alert,
    SpinnerModal
  }
}
</script>
