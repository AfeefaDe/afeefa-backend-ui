<script>
export default {
  data () {
    return {
      editEntrySlotName: 'form',
      editEntry: null,

      item: null,
      imageError: false,
      currentUser: null,
      orgas: null
    }
  },

  mounted () {
    this.editEntry = this.$refs[this.editEntrySlotName]
    this.$validator = this.editEntry.$validator
  },

  watch: {
    'editEntry.item' (item) {
      this.item = item
    },
    'editEntry.imageError' (imageError) {
      this.imageError = imageError
    },
    'editEntry.currentUser' (currentUser) {
      this.currentUser = currentUser
    },
    'editEntry.orgas' (orgas) {
      this.orgas = orgas
    }
  }
}
</script>
