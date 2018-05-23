<template>
  <entry-list
    :items="items"
    :isLoading="isLoading"
    :numItems="items.length"
    facetOwnerType="Orga"
    addEntryButton="orgas.new"
    :sort-function="sortByCreatedAt"
    :options="{facetFilter: true, filter: true, pagination: true, created_at: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByCreatedAt from '@/helpers/sort-by-created-at'
import Orga from '@/models/Orga'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Query: Orga.Query,
      sortByCreatedAt,
      messages: {
        headline: () => this.$t('status.all') + ' ' + this.$tc('headlines.organisations', 2)
      }
    }
  }
}
</script>
