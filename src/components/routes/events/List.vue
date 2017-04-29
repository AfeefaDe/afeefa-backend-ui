<template>
  <entry-list
    :items="items"
    :sort-function="sortByDateStart"
    :options="{pagination: true, date_start: true}"
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
      messages: {
        headline: () => this.$tc('headlines.events', 2)
      }
    }
  }
}
</script>
