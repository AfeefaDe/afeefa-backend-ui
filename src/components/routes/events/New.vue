<template>
  <entry-edit
    id=""
    route-name="events"
    :Resource="Resource"
    :messages="messages"
    :options="{hasDate: true, hasOrga: true}">
  </entry-edit>
</template>

<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import Events from '@/resources/Events'

export default {
  mixins: [EntryEditMixin],

  data () {
    return {
      Resource: Events,
      messages: {
        loading: () => this.$t('status.load_event') + ' ' + this.id,
        saved: () => {
          return `Das Event wurde hinzugefügt.`
        }
      }
    }
  }
}
</script>
