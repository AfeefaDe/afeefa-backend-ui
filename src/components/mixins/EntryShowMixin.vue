<script>
import User from '@/models/User'
import Facet from '@/models/Facet'
import entryListFilters from '@/helpers/entry-list-filters'

export default {
  props: ['id'],

  data () {
    return {
      item: null,
      routeConfig: null,
      currentUser: null,
      loadingError: false,
      currentTab: null,
      currentSubTab: null,
      facets: []
    }
  },

  created () {
    this.initItem(this.id)

    this.currentUser = User.Query.getCurrentUser()

    Facet.Query.getAll().then(facets => {
      this.facets = entryListFilters.getFacetsForOwnerType(facets, this.routeConfig.facetOwnerType)
    })
  },

  beforeRouteUpdate (to, from, next) {
    // page reload with different entry
    // -> short timeout for better user experience :-)
    if (this.id !== to.params.id) {
      this.item = null
      setTimeout(() => {
        this.initItem(to.params.id)
      }, 100)
    }
    next()
  },

  methods: {
    initItem (id) {
      this.loadingError = false

      let relations = []
      if (this.routeConfig.routeName === 'orgas') {
        relations = relations.concat(['past_events', 'upcoming_events'])
      }

      this.routeConfig.Model.Query.with(...relations).get(id).then(entry => {
        this.item = entry

        if (!this.item) {
          this.loadingError = true
        }
      })
    },

    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab
    },

    setCurrentSubTab (newCurrentSubTab) {
      this.currentTab = newCurrentSubTab
    }
  }
}
</script>
