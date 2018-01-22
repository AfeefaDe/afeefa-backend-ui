<script>
import NavigationBreadcrumb from '@/components/navigation/NavigationBreadcrumb'
import { mapState } from 'vuex'
import Users from '@/resources/Users'

export default {
  data () {
    return {
      currentUser: null
    }
  },
  created () {
    this.currentUser = Users.getCurrentUser()
  },
  computed: {
    ...mapState({
      items: state => state.navigation.level1Navigation
    })
  },
  methods: {
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
      if (item.title === 'headlines.dashboard') {
        const area = this.currentUser.area
        return 'Afeefa ' + area.charAt(0).toUpperCase() + area.slice(1)
      } else {
        return this.$tc(item.title, 2)
      }
    },
    logout () {
      this.$store.dispatch('auth/logout').then(result => {
        window.stop() // cancel all requests
        this.$router.push({name: 'login'})
      })
    }
  },
  components: {
    NavigationBreadcrumb
  }
}
</script>
