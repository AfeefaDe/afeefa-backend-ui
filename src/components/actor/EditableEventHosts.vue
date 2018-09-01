<script>
import EditableActorActors from './EditableActorActors'
import EventHostsSelector from '@/components/actor/EventHostsSelector'

export default {
  extends: EditableActorActors,

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
