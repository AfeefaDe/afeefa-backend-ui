<script>
import User from '@/models/User'

export default {
  computed: {
    /*
     * generates the frontend link from the current user context
     *
     * afeefa.de -> leipzig.afeefa.de
     * dev.afeefa.da -> dev.leipzig.afeefa.de
     */
    frontendURL () {
      let url = '//' + process.env.FRONTEND_URL
      const currentUser = User.Query.getCurrentUser()
      if (currentUser && currentUser.area && currentUser.area.toLowerCase() !== 'dresden') {
        url = url.replace(/afeefa/, currentUser.area + '.afeefa')
      }
      return url
    }
  }
}
</script>
