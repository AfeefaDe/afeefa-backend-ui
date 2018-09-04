<template>
  <entry-list
    :items="items"
    :lazyLoad="true"
    :isLoading="isLoading"
    :numItems="items.length"
    facetOwnerType="Orga"
    addEntryButton="orgas.new"
    :options="{facetFilter: true, filter: true, sort: true, pagination: true, created_at: true, updated_at: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import Orga from '@/models/Orga'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Query: Orga.Query,
      messages: {
        headline: () => this.$t('status.all') + ' ' + this.$tc('headlines.organisations', 2)
      }
    }
  }
}
</script>
