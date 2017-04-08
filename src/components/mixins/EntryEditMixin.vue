<script>
import EntryEdit from '@/components/EntryEdit'
import EventBus from '@/services/event-bus'

export default {
  beforeRouteLeave (to, from, next) {
    EventBus.$emit('beforeRouteLeave', {to, from, next})
  },

  components: {
    EntryEdit
  }
}
</script>
