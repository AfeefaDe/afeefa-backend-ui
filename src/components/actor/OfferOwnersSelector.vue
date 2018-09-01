<script>
import ActorSelector from './ActorSelector'

export default {
  extends: ActorSelector,

  methods: {
    saveSelectedActors () {
      return this.actor.$rels.owners.Query.attachMany(this.selectedActors).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Träger wurden gespeichert.'
          })
        }
      })
    }
  }
}
</script>
