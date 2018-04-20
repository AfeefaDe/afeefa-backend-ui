<script>
/**
 * The mixin should be used by any component that includes
 * a slotted form component which itself incorporates the EntryEditApiMixin.
 * The mixin then makes the EntryEditApiMixin properties available in the scope
 * of the including parent component and hence allows slots to access
 * the current item under edit (as well as some other properties)
 */
export default {
  data () {
    return {
      editEntrySlotName: 'form',
      editEntry: null,

      item: null,
      imageError: false,
      currentUser: null
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
    }
  }
}
</script>
