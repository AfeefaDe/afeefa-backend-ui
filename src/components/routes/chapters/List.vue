<template>
  <entry-list
    :items="items"
    addEntryButton="chapters.new"
    :options="{filter: true, pagination: true, hideTypeIcon: true, linkToItem: 'edit'}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import Chapter from '@/models/Chapter'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Chapter,
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
