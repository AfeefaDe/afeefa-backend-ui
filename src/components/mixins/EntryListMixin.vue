<script>
import EntryList from '@/components/entry/EntryList'

export default {
  data () {
    return {
      items: null
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
    loadItems () {
      const queryParams = this.getQueryParams()
      const currentRouteQuery = this.$route.query
      this.Resource.getAll(queryParams).then(entries => {
        // protect loading items into already left view
        if (currentRouteQuery === this.$route.query) {
          this.items = entries
        }
      })
    }
  },

  components: {
    EntryList
  }
}
</script>
