<script>
import EntryDetail from '@/components/entry/show/EntryDetail'
import LoadingStrategy from '@/store/api/LoadingStrategy'

export default {
  props: ['id'],

  data () {
    return {
      item: null,
      routeConfig: null,
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
    }
    next()
  },

  methods: {
    initItem (id) {
      this.loadingError = false

      this.routeConfig.Resource.get(id, null, null, {
        'fetchParentOrga': LoadingStrategy.RETURN_CACHED_IF_FULLY_LOADED_OR_LOAD
      }).then(entry => {
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
