<template>
<div>Show Chapter</div>
</template>


<script>
import Chapters from '@/resources/Chapters'
import EntryShowMixin from '@/components/mixins/EntryShowMixin'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      Resource: Chapters,
      messages: {
        loading: () => this.$t('status.load_event') + ' ' + this.id,
        loadingError: () => this.$t('errors.loadingEntryError') + ' ' + this.id,
        activateHeadline: active => {
          return `Event ${active ? 'verbergen' : 'veröffentlichen'}`
        },
        activate: active => {
          return `Soll das Event "${this.item.title}" ${active ? 'verborgen' : 'veröffentlicht'} werden?`
        },
        activated: active => {
          return `Das Event ${active ? 'wurde veröffentlicht' : ' ist nun nicht mehr öffentlich sichtbar'}.`
        }
      }
    }
  }
}
</script>
