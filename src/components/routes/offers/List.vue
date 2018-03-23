<template>
  <entry-list
    :items="items"
    addEntryButton="offers.new"
    :options="{filter: true, pagination: true, hideTypeIcon: true}"
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
        headline: () => {
          return this.$tc('offers.offer', 2)
        }
      }
    }
  },

  watch: {
    '$route.name': function () {
      this.items = null
      this.loadItems()
    }
  }
}
</script>
