<template>
  <entry-list
    :items="items"
    addEntryButton="orgas.new"
    :sort-function="sortByTitle"
    :options="{pagination: true, created_at: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByTitle from '@/helpers/sort-by-title'
import Orgas from '@/resources/Orgas'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Orgas,
      sortByTitle,
      messages: {
        headline: () => this.$t('status.all') + ' ' + this.$tc('headlines.organisations', 2)
      }
    }
  }
}
</script>
