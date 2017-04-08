<template>
  <entry-list
    :items="items"
    :sort-function="sortByUpdatedAt"
    :options="{pagination: true, updated_at: true}"
    :messages="messages">
  </entry-list>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByUpdatedAt from '@/helpers/sort-by-title'
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
