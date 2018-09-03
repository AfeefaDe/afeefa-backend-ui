<script>
export default {
  beforeRouteLeave (to, from, next) {
    const form = this.$refs.form || this

    if (form.$canLeaveRoute) {
      // goto login form after api/logout click
      if (to.name === 'login') {
        next()
        return
      }

      // form is not dirty
      const result = form.$canLeaveRoute()
      if (result === true) {
        next()
        return
      }

      // result is expected to contain a dialog message
      this.$store.dispatch('messages/showDialog', {
        title: 'Abbrechen?',
        message: result
      }).then(result => {
        if (result === 'yes') {
          next()
        }
      })
    } else {
      next()
    }
  }
}
</script>
