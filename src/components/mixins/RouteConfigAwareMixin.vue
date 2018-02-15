<script>
/**
 * The mixin just delegates the given routeConfig properties
 * to the main component scope. For convenience.
 */
export default {
  props: ['routeConfig'],

  computed: {
    Model () {
      return this.routeConfig.Model
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
