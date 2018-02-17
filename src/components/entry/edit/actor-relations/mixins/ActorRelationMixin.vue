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
      ActorRelations.joinActorRelation(this.apiRelationName, this.actor, child).then(result => {
        if (result) {
          this.actor[this.relationName].push(child)
          this.$store.dispatch('messages/showAlert', {
            description: this.messages.addChildSuccess(child)
          })
          this.$emit('itemAdded', child)
        }
      })
    },

    removeChild (child) {
      ActorRelations.leaveActorRelation(this.apiRelationName, this.actor, child).then(result => {
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
      ActorRelations.joinActorRelation(this.apiRelationName, parent, this.actor).then(result => {
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
      ActorRelations.leaveActorRelation(this.apiRelationName, parent, this.actor).then(result => {
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
