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
    this.Resource.getAll().then(entries => {
      this.items = entries
    })
  },

  components: {
    EntryList
  }
}
</script>
