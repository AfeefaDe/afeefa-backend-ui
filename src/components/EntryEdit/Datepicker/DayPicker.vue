<script>
import VueFlatpickr from './Flatpickr'
import moment from 'moment'

export default {
  mixins: [VueFlatpickr],

  mounted () {
    const $timeContainer = this.fp.calendarContainer
    if ($timeContainer.querySelectorAll('button').length === 0) {
      let $button = document.createElement('button')
      $button.className = 'btn btn-today'
      $button.innerText = 'Today'
      $button.addEventListener('click', () => {
        this.fp.setDate(moment().startOf('day').toDate())
      })
      $timeContainer.appendChild($button)

      $button = document.createElement('button')
      $button.className = 'btn btn-today'
      $button.innerText = 'Tomorrow'
      $button.addEventListener('click', () => {
        this.fp.setDate(moment().startOf('day').add(1, 'day').toDate())
      })
      $timeContainer.appendChild($button)
    }
  }
}
</script>


<style lang="scss">
.btn-today {
  height: 22px;
  line-height: 24px;
  padding: 0 0.5rem;
  font-size: .8em;
  margin: 10px 5px;
}

</style>
