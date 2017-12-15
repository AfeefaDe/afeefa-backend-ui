<template>
  <entry-edit
    :id="id"
    route-name="events"
    :Resource="Resource"
    :messages="messages"
    :options="{hasDate: true, hasOrga: true, hasDelete: true}"
    ref="form">
  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEdit from '@/components/EntryEdit/EntryEdit'

import Events from '@/resources/Events'

export default {
  mixins: [BeforeRouteLeaveMixin],
  components: {
    EntryEdit
  },
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
