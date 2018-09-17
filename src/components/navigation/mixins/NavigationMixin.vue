<script>
import NavigationBreadcrumb from '@/components/navigation/NavigationBreadcrumb'
import AfeefaLogo from '@/components/navigation/AfeefaLogo'
import { mapState } from 'vuex'
import User from '@/models/User'

export default {
  data () {
    return {
      currentUser: null
    }
  },
  created () {
    this.currentUser = User.Query.getCurrentUser()
  },
  computed: {
    ...mapState({
      items: state => state.navigation.level1Navigation
    })
  },
  methods: {
    /* hacky way to hide chapter feature in bautzen */
    showSideBarItem (item) {
      if (item.route === 'navigation.show' && this.currentUser.area === 'bautzen') return false
      if (item.route === 'chapters.list' && this.currentUser.area === 'bautzen') return false
      if (item.route === 'facets.list' && !this.currentUser.isAdmin()) return false
      return true
    },
    changeLanguage () {
      if (this.$i18n.locale === 'de') {
        this.$i18n.locale = 'en'
        this.$validator.setLocale('en')
      } else {
        this.$i18n.locale = 'de'
        this.$validator.setLocale('de')
      }
    },
    translateTitle (item) {
      return this.$tc(item.title, 2)
    },
    logout () {
      this.$store.dispatch('auth/logout').then(result => {
        window.stop() // cancel all requests
        this.$router.push({name: 'login'})
      })
    }
  },
  components: {
    NavigationBreadcrumb,
    AfeefaLogo
  }
}
</script>
