<template>
  <entry-list
    :items="items"
    :isLoading="isLoading"
    addEntryButton="chapters.new"
    :customSortOrders="[{ sort: sortByTitle }]"
    :options="{filter: true, pagination: true, hideTypeIcon: true, linkToItem: 'edit'}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import Chapter from '@/models/Chapter'
import sortByTitle from '@/helpers/sort-by-title'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Query: Chapter.Query,
      sortByTitle,
      messages: {
        headline: () => {
          return this.$tc('headlines.chapters', 2)
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
