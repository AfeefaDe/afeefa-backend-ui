<template>
  <entry-list
    :items="items"
    addEntryButton="events.new"
    :sort-function="sortByDateStart"
    :options="{pagination: true, event_date: true}"
    :messages="messages"
    type="events"
    @input="updateEntryList">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByDateStart from '@/helpers/sort-by-date-start'
import Events from '@/resources/Events'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Events,
      sortByDateStart,
      messages: {
        headline: () => this.$tc('headlines.events', 2)
      }
    }
  },

  watch: {
    '$route.query.filter': function (filter) {
      this.loadItems()
    }
  },

  methods: {
    updateEntryList (showPastEvents) {
      let filter
      if (showPastEvents) {
        filter = 'past'
      } else {
        filter = 'upcoming'
      }
      this.updateFilterQuery(filter)
    },
    updateFilterQuery (filter) {
      // update url query
      const query = {...this.$route.query}
      delete query.page
      delete query.pageSize
      query.filter = filter
      this.$router.replace({query: query})
    },
    getQueryParams () {
      // init filter
      if (this.$route.query.filter === undefined) {
        this.updateFilterQuery('upcoming')
        return {'filter[date]': 'upcoming'}
      }
      return {'filter[date]': this.$route.query.filter}
    }
  }
}
</script>
