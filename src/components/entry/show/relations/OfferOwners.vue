<script>
import ActorActors from './ActorActors'
import OfferOwnersSelector from '@/components/selector/OfferOwnersSelector'

export default {
  extends: ActorActors,

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
