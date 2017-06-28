<script>
import EntryDetail from '@/components/EntryDetail/EntryDetail'

export default {
  props: ['id'],

  data () {
    return {
      item: null,
      Resource: null,
      loadingError: false
    }
  },

  created () {
    this.initItem(this.id)
  },

  beforeRouteUpdate (to, from, next) {
    // page reload with different entry
    // -> short timeout for better user experience :-)
    if (this.id !== to.params.id) {
      this.item = null
      setTimeout(() => {
        this.initItem(to.params.id)
      }, 100)
    } else {
      this.initItem(to.params.id)
    }
    next()
  },

  methods: {
    initItem (id) {
      this.loadingError = false
      this.Resource.get(id).then(entry => {
        this.item = entry
        if (!this.item) {
          this.loadingError = true
        }
      })
    }
  },

  components: {
    EntryDetail
  }
}
</script>
