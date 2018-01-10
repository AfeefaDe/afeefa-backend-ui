<script>
export default {
  computed: {
    /*
     * generates the frontend link from the current user context
     */
    frontendURL () {
      let url = '//'
      if (this.currentUser && this.currentUser.area && this.currentUser.area.toLowerCase() !== 'dresden') {
        url += this.currentUser.area + '.'
      }
      return url + process.env.FRONTEND_URL
    }
  }
}
</script>
