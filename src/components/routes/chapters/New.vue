<template>
<div>Chapter Erstellen</div>
</template>

<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import Chapters from '@/resources/Chapters'

export default {
  mixins: [EntryEditMixin],

  data () {
    return {
      Resource: Chapters,
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
