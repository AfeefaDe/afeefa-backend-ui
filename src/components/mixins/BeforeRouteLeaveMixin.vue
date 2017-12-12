<script>
export default {
  beforeRouteLeave (to, from, next) {
    if (this.$refs.form && this.$refs.form.$canLeaveRoute) {
      // goto login form after api/logout click
      if (to.name === 'login') {
        next()
        return
      }

      // form is not dirty
      const result = this.$refs.form.$canLeaveRoute()
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
