<script>
export default {
  props: ['routeConfig'],

  computed: {
    Resource () {
      return this.routeConfig.Resource
    },
    routeName () {
      return this.routeConfig.routeName
    },
    messages () {
      return this.routeConfig.messages
    }
  }
}
</script>
