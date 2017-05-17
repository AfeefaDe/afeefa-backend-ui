<template>
  <entry-list
    :items="items"
    :addEntryButton="false"
    :sort-function="sortByUpdatedAt"
    :options="{pagination: true, updated_at: true, annotations: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByUpdatedAt from '@/helpers/sort-by-updated-at'
import Todos from '@/resources/Todos'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Todos,
      sortByUpdatedAt,
      messages: {
        headline: () => this.$t('headlines.todos')
      }
    }
  }
}
</script>
