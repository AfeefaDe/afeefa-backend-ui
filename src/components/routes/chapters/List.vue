<template>
  <entry-list
    :items="items"
    addEntryButton="chapters.new"
    :sort-function="sortByTitle"
    :options="{pagination: true, hideTypeIcon: true, linkToItem: 'edit'}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import Chapters from '@/resources/Chapters'
import sortByTitle from '@/helpers/sort-by-title'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Chapters,
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
