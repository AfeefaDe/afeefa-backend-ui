<script>
import EditableActorActors from './EditableActorActors'
import OfferOwnersSelector from '@/components/actor/OfferOwnersSelector'

export default {
  extends: EditableActorActors,

  data () {
    return {
      selector: OfferOwnersSelector
    }
  },

  methods: {
    reloadActors () {
      return this.owner.$rels[this.relationName].refetch()
    }
  }
}
</script>
