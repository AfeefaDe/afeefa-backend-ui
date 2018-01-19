<template>
  <div id="app">
    <router-view></router-view>

    <vue-progress-bar></vue-progress-bar>

    <save-info></save-info>
    <dialog-window></dialog-window>
    <alert></alert>
  </div>
</template>


<script>
import PowerSelector from '@/components/PowerSelector'
import Alert from '@/components/Alert'
import DialogWindow from '@/components/Dialog'
import SaveInfo from '@/components/SaveInfo'

import 'flatpickr/dist/themes/material_green.css'
import 'leaflet/dist/leaflet.css'
import '@/assets/styles/app.scss'


export default {
  components: {
    PowerSelector,
    DialogWindow,
    Alert,
    SaveInfo
  }
}
</script>
