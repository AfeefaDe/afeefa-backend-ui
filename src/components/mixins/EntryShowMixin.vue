<script>
import EntryDetail from '@/components/EntryDetail'

export default {
  props: ['id'],

  data () {
    return {
      item: null,
      Resource: null
    }
  },

  created () {
    this.initItem(this.id)
  },

  beforeRouteUpdate (to, from, next) {
    // page reload with different entry
    // -> short timeout for better user experience :-)
    this.item = null
    setTimeout(() => {
      this.initItem(to.params.id)
    }, 100)
    next()
  },

  methods: {
    initItem (id) {
      this.Resource.get(id).then(entry => {
        this.item = entry
      })
    }
  },

  components: {
    EntryDetail
  }
}
</script>
