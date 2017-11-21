<template>
  <entry-edit
    :id="id"
    route-name="orgas"
    :Resource="Resource"
    :messages="messages"
    :options="{hasParentOrga: true, hasDelete: true}">
  </entry-edit>
</template>

<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import Orgas from '@/resources/Orgas'

export default {
  mixins: [EntryEditMixin],

  props: ['id'],

  data () {
    return {
      Resource: Orgas,
      messages: {
        loading: () => this.$t('status.load_orga') + ' ' + this.id,
        loadingError: () => this.$t('errors.loadingEntryError') + ' ' + this.id,
        deleteHeadline: () => {
          return `Orga löschen`
        },
        delete: item => {
          return `Soll die Orga "${item.title}" gelöscht werden?`
        },
        deleted: () => {
          return `Die Orga wurde gelöscht.`
        },
        saved: () => {
          return `Die Orga wurde gespeichert.`
        }
      }
    }
  }
}
</script>
