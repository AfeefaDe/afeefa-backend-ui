<template>
  <entry-detail
    :entry="item"
    route-name="events"
    :Resource="Resource"
    :messages="messages"
    :options="{hasDate: true, hasOrga: true}">
  </entry-detail>
</template>


<script>
import Events from '@/resources/Events'
import EntryShowMixin from '@/components/mixins/EntryShowMixin'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      Resource: Events,
      messages: {
        loading: () => this.$t('status.load_event') + ' ' + this.id,
        activateHeadline: active => {
          return `Event ${active ? 'verbergen' : 'veröffentlichen'}`
        },
        activate: active => {
          return `Soll das Event "${this.item.title}" ${active ? 'verborgen' : 'veröffentlicht'} werden?`
        },
        activated: active => {
          return `Das Event wurde ${active ? 'veröffentlicht' : 'verborgen'}.`
        }
      }
    }
  }
}
</script>
