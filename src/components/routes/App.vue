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

export default {
  components: {
    DialogWindow,
    Alert
  }
}
</script>

<style src="../../assets/styles/app.scss" lang="scss"></style>
