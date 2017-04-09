<template>
  <div id="app">
    <router-view></router-view>
    <dialog-window></dialog-window>
    <alert></alert>
  </div>
</template>


<script>
import Alert from '@/components/Alert'
import DialogWindow from '@/components/Dialog'

import 'flatpickr/dist/themes/base16_flat.css'
import 'leaflet/dist/leaflet.css'
import '@/assets/styles/app.scss'


export default {
  components: {
    DialogWindow,
    Alert
  }
}
</script>
