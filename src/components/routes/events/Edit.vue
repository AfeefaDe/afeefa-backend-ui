<template>
  <entry-edit
    :id="id"
    route-name="events"
    :Resource="Resource"
    :messages="messages"
    :options="{hasDate: true, hasOrga: true, hasDelete: true}">
  </entry-edit>
</template>

<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import Events from '@/resources/Events'

export default {
  mixins: [EntryEditMixin],

  props: ['id'],

  data () {
    return {
      Resource: Events,
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
