<template>
  <entry-list
    :items="items"
    :isLoading="isLoading"
    :numItems="items.length"
    facetEntryType="Orga"
    addEntryButton="orgas.new"
    :sort-function="sortByCreatedAt"
    :options="{facetFilter: true, filter: true, pagination: true, created_at: true}"
    :messages="messages">

    <div slot="sidebar" class="mainCard sidebar" v-if="items.length">
      <facet-item-filter-bar type="Orga" :entries="items" />
    </div>
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByCreatedAt from '@/helpers/sort-by-created-at'
import Orga from '@/models/Orga'

import FacetItemFilterBar from '@/components/facet/FacetItemFilterBar'

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
  },

  components: {
    FacetItemFilterBar
  }
}
</script>
