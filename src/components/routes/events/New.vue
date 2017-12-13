<template>
  <entry-edit
    id=""
    route-name="events"
    :Resource="Resource"
    :messages="messages"
    :options="{hasDate: true, hasOrga: true}"
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
