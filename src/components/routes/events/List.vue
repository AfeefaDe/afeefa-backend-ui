<template>
  <entry-list
    :items="items"
    addEntryButton="events.new"
    :sort-function="sortFunction"
    :sort-order="sortOrder"
    :options="{filter: true, pagination: true, event_date: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByDateMixin from '@/helpers/sort-by-date-mixin'
import Events from '@/resources/Events'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Events,
      sortFunction: sortByDateStart,
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
  },

  methods: {
    getQueryParams () {
      this.sortOrder = this.$route.name === 'events.upcoming' ? 'ASC' : 'DESC'
      this.sortFunction = this.$route.name === 'events.past' ? sortByDateStart : sortByDateMixin

      if (this.$route.name === 'events.past') {
        return {'filter[date]': 'past'}
      } else if (this.$route.name === 'events.upcoming') {
        return {'filter[date]': 'upcoming'}
      }
    }
  }
}
</script>
