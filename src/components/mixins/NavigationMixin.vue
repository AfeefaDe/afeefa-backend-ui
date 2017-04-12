<script>
import NavigationBreadcrumb from './../NavigationBreadcrumb'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser,
      items: state => state.navigation.level1Navigation
    }),
    username () {
      return this.currentUser ? this.currentUser.forename + ' ' + this.currentUser.surname : ''
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout').then(result => {
        this.$router.push({name: 'login'})
      })
    }
  },
  components: {
    NavigationBreadcrumb
  }
}
</script>
