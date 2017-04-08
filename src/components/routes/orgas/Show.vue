<template>
  <entry-detail
    :entry="item"
    route-name="orgas"
    :Resource="Resource"
    :messages="messages"
    :options="{hasParentOrga: true}">
  </entry-detail>
</template>


<script>
import Orgas from '@/resources/Orgas'
import EntryShowMixin from '@/components/mixins/EntryShowMixin'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      Resource: Orgas,
      messages: {
        loading: () => this.$t('status.load_orga') + ' ' + this.id,
        activateHeadline: active => {
          return `Orga ${active ? 'de' : ''}aktivieren`
        },
        activate: active => {
          return `Soll die Orga "${this.item.title}" ${active ? 'de' : ''}aktiviert werden?`
        },
        activated: active => {
          return `Die Orga wurde ${active ? '' : 'de'}aktiviert.`
        }
      }
    }
  }
}
</script>
