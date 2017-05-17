<template>
  <entry-list
    :items="items"
    addEntryButton="events.new"
    :sort-function="sortByDateStart"
    :options="{pagination: true, event_date: true}"
    :messages="messages">
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
      queryParams: {'filter[date]': 'upcoming'},
      messages: {
        headline: () => this.$tc('headlines.events', 2)
      }
    }
  }
}
</script>
