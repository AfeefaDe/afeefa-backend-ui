<script>
export default {
  methods: {
    /*
     * calls the validateAll() method on all inputs in the affected component and returns a promise
     */
    validateForm () {
      return this.$validator.validateAll().then(result => {
        if (!result) {
          return this.$validator.errors.items
        } else {
          return false
        }
      })
    }
  }
}
</script>
