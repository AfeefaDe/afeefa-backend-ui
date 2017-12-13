<template>
  <entry-edit
    id=""
    route-name="orgas"
    :Resource="Resource"
    :messages="messages"
    :options="{hasParentOrga: true}"
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
  data () {
    return {
      Resource: Orgas,
      messages: {
        loading: () => this.$t('status.load_orga') + ' ' + this.id,
        saved: () => {
          return `Die Orga wurde hinzugefügt.`
        }
      }
    }
  }
}
</script>
