<script>
import ActorActors from './ActorActors'
import EventHostsSelector from '@/components/selector/EventHostsSelector'

export default {
  extends: ActorActors,

  data () {
    return {
      selector: EventHostsSelector
    }
  },

  methods: {
    reloadActors () {
      return this.owner.$rels[this.relationName].refetch()
    }
  }
}
</script>
