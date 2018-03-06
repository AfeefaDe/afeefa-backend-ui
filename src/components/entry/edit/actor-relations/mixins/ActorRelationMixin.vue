<script>
import Orga from '@/models/Orga'
import ActorRelations from '@/models/ActorRelations'
import sortByTitle from '@/helpers/sort-by-title'

export default {
  props: ['actor'],

  data () {
    return {
      relationName: null,
      apiRelationName: null,

      selectableActors: [],

      messages: {
        addChildSuccess: child => `Der Akteur ${child.title} wurde hinzugefügt.`,
        removeChildSuccess: child => `Der Akteur ${child.title} wurde entfernt.`,
        addParentSuccess: child => `Der Akteur wurde zu ${child.title} wurde hinzugefügt.`,
        removeParentSuccess: child => `Der Akteur wurde von ${child.title} entfernt.`
      }
    }
  },

  computed: {
    selectedActors () {
      return this.actor[this.relationName]
    },

    relation () {
      return this.actor.$rels.actor_relations
    }
  },

  created () {
    Orga.getAll().then(actors => {
      this.selectableActors = this.sortSelectableActors(actors)
    })
  },

  methods: {
    sortSelectableActors (actors) {
      return sortByTitle(actors)
    },

    addChild (child) {
      return this.actor.actor_relations.$rels[this.apiRelationName].attach(child).then(result => {
        if (result) {
          this.actor[this.relationName].push(child) // add child to our cloned actor to edit to show up instantly
          this.$store.dispatch('messages/showAlert', {
            description: this.messages.addChildSuccess(child)
          })
          this.$emit('itemAdded', child)
        }
      })
    },

    removeChild (child) {
      return this.actor.actor_relations.$rels[this.apiRelationName].detach(child).then(result => {
        if (result) {
          this.actor[this.relationName] = this.actor[this.relationName].filter(n => n.id !== child.id)
          this.$store.dispatch('messages/showAlert', {
            description: this.messages.removeChildSuccess(child)
          })
          this.$emit('itemRemoved', child)
        }
      })
    },

    addParent (parent) {
      // we might not have the parent's relations initialized, so we just create a runtime model
      const actorRelations = new ActorRelations()
      actorRelations.id = parent.id
      return actorRelations.$rels[this.apiRelationName].attach(this.actor).then(result => {
        if (result) {
          this.actor[this.relationName].push(parent)
          this.$store.dispatch('messages/showAlert', {
            description: this.messages.addParentSuccess(parent)
          })
          this.$emit('itemAdded', parent)
        }
      })
    },

    removeParent (parent) {
      // we might not have the parent's relations initialized, so we just create a runtime model
      const actorRelations = new ActorRelations()
      actorRelations.id = parent.id
      return actorRelations.$rels[this.apiRelationName].detach(this.actor).then(result => {
        if (result) {
          this.actor[this.relationName] = this.actor[this.relationName].filter(n => n.id !== parent.id)
          this.$store.dispatch('messages/showAlert', {
            description: this.messages.removeParentSuccess(parent)
          })
          this.$emit('itemRemoved', parent)
        }
      })
    }
  }
}
</script>
