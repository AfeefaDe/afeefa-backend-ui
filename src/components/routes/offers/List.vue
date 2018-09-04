<template>
  <entry-list
    :items="items"
    :lazyLoad="true"
    :isLoading="isLoading"
    :numItems="items.length"
    facetOwnerType="Offer"
    addEntryButton="offers.new"
    :options="{facetFilter: true, filter: true, sort: true, pagination: true, created_at: true, updated_at: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import Offer from '@/models/Offer'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Query: Offer.Query,
      messages: {
        headline: () => this.$t('status.all') + ' ' + this.$tc('offers.offer', 2)
      }
    }
  }
}
</script>
