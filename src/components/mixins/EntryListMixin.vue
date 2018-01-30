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
      this.Resource.getAll(queryParams).then(entries => {
        this.items = entries
      })
    }
  },

  components: {
    EntryList
  }
}
</script>
