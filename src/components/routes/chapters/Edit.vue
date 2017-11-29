<template>
<div>Edit Chapter</div>
</template>

<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import Chapters from '@/resources/Chapters'

export default {
  mixins: [EntryEditMixin],

  props: ['id'],

  data () {
    return {
      Resource: Chapters,
      messages: {
        loading: () => this.$t('status.load_event') + ' ' + this.id,
        loadingError: () => this.$t('errors.loadingEntryError') + ' ' + this.id,
        deleteHeadline: () => {
          return `Event löschen`
        },
        delete: item => {
          return `Soll das Event "${item.title}" gelöscht werden?`
        },
        deleted: () => {
          return `Das Event wurde gelöscht.`
        },
        saved: () => {
          return `Das Event wurde gespeichert.`
        }
      }
    }
  }
}
</script>
