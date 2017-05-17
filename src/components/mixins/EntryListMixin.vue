<script>
import EntryList from '@/components/EntryList'

export default {
  props: ['Resource'],

  data () {
    return {
      items: null,
      queryParams: null
    }
  },

  created () {
    this.Resource.getAll(this.queryParams).then(entries => {
      this.items = entries
    })
  },

  components: {
    EntryList
  }
}
</script>
