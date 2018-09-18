<script>
import Orga from '@/models/Orga'
import sortByTitle from '@/helpers/sort-by-title'

export default {
  props: ['actor', 'relationName'],

  data () {
    return {
      allActors: [],
      selectableActors: [],
      initialSelectedActors: [],
      selectedActors: [],
      isLoading: false,
      isEntryDetailSectionContent: true
    }
  },

  created () {
    this.initSelectedActors()
  },

  watch: {
    items () {
      this.initSelectedActors()
    }
  },

  computed: {
    items () {
      return this.actor[this.relationName]
    }
  },

  methods: {
    loadSelectableActors () {
      this.isLoading = true
      Orga.Query.getAll().then(actors => {
        this.allActors = sortByTitle(actors)
        this.initSelectableActors()
        this.isLoading = false
      })
    },

    initSelectableActors () {
      this.selectableActors = this.allActors.filter(a => !this.selectedActors.includes(a))
    },

    initSelectedActors () {
      this.selectedActors = []
      this.actor[this.relationName].forEach(actor => {
        this.selectedActors.push(actor)
      })
      this.initialSelectedActors = this.selectedActors.concat()
    },

    addActor (actor) {
      this.selectedActors.push(actor)
      this.initSelectableActors()
    },

    removeActor (actor) {
      this.selectedActors = this.selectedActors.filter(a => a !== actor)
      this.initSelectableActors()
    },

    startActorRelationSave () {
      // pls override
    },

    actorRelationSaved () {
      // pls override
    },

    saveSelectedActors () {
      this.startActorRelationSave()

      if (this.actor.id) {
        return this.actor.$rels[this.relationName].Query.attachMany(this.selectedActors).then(result => {
          if (result) {
            this.$store.dispatch('messages/showAlert', {
              description: 'Die Akteure wurden gespeichert.'
            })
            this.actorRelationSaved()
          }
        })
      } else {
        this.actorRelationSaved()
      }
    },

    reloadActors () {
      return this.actor.$rels[this.relationName].refetch()
    }
  }
}
</script>
