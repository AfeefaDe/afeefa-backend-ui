<script>
import VueFlatpickr from './Flatpickr'

export default {
  mixins: [VueFlatpickr],

  mounted () {
    const $timeContainer = this.fp.timeContainer
    if ($timeContainer.querySelectorAll('button').length === 0) {
      const $div = document.createElement('div')
      $div.innerHTML = '<button class="btn time-picker-btn"><i class="material-icons">done</i></button>'
      $div.addEventListener('click', () => {
        this.fp.close()
      })
      $timeContainer.appendChild($div)
    }
  }
}
</script>

<style lang="scss">
button.time-picker-btn {
  display: flex
}
</style>