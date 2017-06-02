<script>
import EntryList from '@/components/EntryList'

export default {
  props: ['Resource'],

  data () {
    return {
      items: null
    }
  },

  created () {
    this.loadItems()
  },

  methods: {
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
