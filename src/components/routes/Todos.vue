<template>
  <div>
    <entry-list
      :items="items"
      :lazyLoad="true"
      :isLoading="isLoading"
      :numItems="numTodos"
      :addEntryButton="false"
      :sort-function="sortByUpdatedAt"
      :options="{filter: true, pagination: true, updated_at: true, annotations: true, event_date: true}"
      :messages="messages">

      <div v-if="!isLoading">
        <select id="annotationCategory" v-model="selectedCategory" class="filterSelect">
          <option value="all" selected>Alle Anmerkungen</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" v-if="cat.count_entries">
            {{ cat.title }} ({{ cat.count_entries }})
          </option>
        </select>
      </div>

    </entry-list>
  </div>
</template>


<script>
import EntryListMixin from '@/components/mixins/EntryListMixin'
import sortByUpdatedAt from '@/helpers/sort-by-updated-at'
import TodosQuery from '@/resources/Todos'
import AnnotationCategory from '@/models/AnnotationCategory'
import { mapState } from 'vuex'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Query: TodosQuery,
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

  computed: {
    ...mapState({
      numTodos: state => state.navigation.numTodos
    })
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


<style lang="scss" scoped>
.filterSelect {
  display: block;
  margin-bottom: .5em;
  width: auto;
  height: auto;
}
</style>
