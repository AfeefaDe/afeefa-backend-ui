<template>
  <div>
    <entry-list
      :items="items"
      :addEntryButton="false"
      :sort-function="sortByUpdatedAt"
      :options="{filter: true, pagination: true, updated_at: true, annotations: true, event_date: true}"
      :messages="messages">

      <div>
        <label for="annoationCategory">Todos filtern</label>
        <select id="annotationCategory" v-model="selectedCategory" style="display: block;">
          <option value="all" selected>Alle Anmerkungen</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{cat.title}}</option>
        </select>
      </div>

    </entry-list>
  </div>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByUpdatedAt from '@/helpers/sort-by-updated-at'
import Todos from '@/resources/Todos'
import AnnotationCategory from '@/models/AnnotationCategory'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Query: Todos,
      categories: [],
      sortByUpdatedAt,
      selectedCategory: 'all',
      messages: {
        headline: () => this.$t('status.all') + ' ' + this.$t('headlines.todos')
      }
    }
  },
  created () {
    AnnotationCategory.Query.getAll().then(categories => {
      this.categories = categories
    })
  },
  watch: {
    'selectedCategory': function (selectedCategory) {
      this.items = null
      this.loadItems()
    }
  },
  methods: {
    getQueryParams () {
      if (this.selectedCategory !== 'all') {
        return {'filter[annotation_category_id]': this.selectedCategory}
      }
    }
  }
}
</script>
