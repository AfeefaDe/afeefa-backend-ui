<template>
  <entry-list
    :items="items"
    addEntryButton="chapters.new"
    :options="{pagination: true, hideTypeIcon: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import Chapters from '@/resources/Chapters'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Chapters,
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
