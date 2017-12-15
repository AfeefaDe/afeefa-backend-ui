<template>
  <entry-edit
    :id="id"
    route-name="orgas"
    :Resource="Resource"
    :messages="messages"
    :options="{hasParentOrga: true, hasDelete: true}"
    ref="form">
  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEdit from '@/components/EntryEdit/EntryEdit'

import Orgas from '@/resources/Orgas'

export default {
  mixins: [BeforeRouteLeaveMixin],
  components: {
    EntryEdit
  },
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
