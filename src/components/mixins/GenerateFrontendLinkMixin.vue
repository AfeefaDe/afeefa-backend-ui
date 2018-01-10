<script>
import Users from '@/resources/Users'

export default {
  computed: {
    /*
     * generates the frontend link from the current user context
     */
    frontendURL () {
      let url = '//'
      const currentUser = Users.getCurrentUser()
      if (currentUser && currentUser.area && currentUser.area.toLowerCase() !== 'dresden') {
        url += currentUser.area + '.'
      }
      return url + process.env.FRONTEND_URL
    }
  }
}
</script>
