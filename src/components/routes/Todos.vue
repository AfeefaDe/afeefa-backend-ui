<template>
  <div>
    <entry-list
      :items="items"
      :addEntryButton="false"
      :sort-function="sortByUpdatedAt"
      :options="{pagination: true, updated_at: true, annotations: true}"
      :messages="messages">
      <label for="annoationCategory">Todos filtern</label>
      <select id="annotationCategory" v-model="selectedCategory" style="display: block">
        <option value="all" selected>Alle Anmerkungen</option>
        <option v-for="cat in categories" :value="cat.id">{{cat.title}}</option>
      </select>

    </entry-list>
  </div>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByUpdatedAt from '@/helpers/sort-by-updated-at'
import Todos from '@/resources/Todos'
import AnnotationCategories from '@/resources/AnnotationCategories'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Todos,
      categories: [],
      sortByUpdatedAt,
      selectedCategory: 'all',
      messages: {
        headline: () => this.$t('status.all') + ' ' + this.$t('headlines.todos')
      }
    }
  },
  created () {
    AnnotationCategories.getAll().then(categories => {
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
        return {'filter[category]': this.selectedCategory}
      }
    }
  }
}
</script>
