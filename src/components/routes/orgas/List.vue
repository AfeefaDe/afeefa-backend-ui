<template>
  <entry-list
    :items="items"
    addEntryButton="orgas.new"
    :sort-function="sortByCreatedAt"
    :options="{pagination: true, created_at: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByCreatedAt from '@/helpers/sort-by-created-at'
import Orgas from '@/resources/Orgas'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Orgas,
      sortByCreatedAt,
      messages: {
        headline: () => this.$t('status.all') + ' ' + this.$tc('headlines.organisations', 2)
      }
    }
  }
}
</script>
