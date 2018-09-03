<script>
import EntryList from '@/components/entry/list/EntryList'

export default {
  data () {
    return {
      items: [],
      isLoading: false
    }
  },

  created () {
    this.beforeCreated()
    this.loadItems()
  },

  methods: {
    beforeCreated () {
      return null
    },

    getQueryParams () {
      return null
    },

    itemsLoaded (entries) {
      // hook
    },

    loadItems () {
      this.items = []
      this.isLoading = true
      const queryParams = this.getQueryParams()
      const currentRouteQuery = this.$route.query
      this.Query.getAll(queryParams).then(entries => {
        // protect loading items into already left view
        // TODO refactor events.list into proper tabs
        if (currentRouteQuery.tab === this.$route.query.tab && currentRouteQuery.subTab === this.$route.query.subTab) {
          this.items = entries
          this.itemsLoaded(entries)
          this.isLoading = false
        }
      })
    }
  },

  components: {
    EntryList
  }
}
</script>
