<template>
  <entry-edit
    id=""
    route-name="orgas"
    :Resource="Resource"
    :messages="messages"
    :options="{hasParentOrga: true}">
  </entry-edit>
</template>

<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import Orgas from '@/resources/Orgas'

export default {
  mixins: [EntryEditMixin],

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
