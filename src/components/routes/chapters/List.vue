<template>
<div>List Chapters</div>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import Chapters from '@/resources/Chapters'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Chapters,
      sortOrder: 'ASC',
      messages: {
        headline: () => {
          if (this.$route.name === 'events.past') {
            return this.$t('headlines.pastEvents')
          } else if (this.$route.name === 'events.upcoming') {
            return this.$t('headlines.upcomingEvents')
          } else {
            return this.$tc('headlines.events', 2)
          }
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
