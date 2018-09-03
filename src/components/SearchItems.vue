<template>
<div>
  <div>
    <search-field
      :filterOptions="filterOptions"
      filterDefault="any"
      @input="updateItems">
    </search-field>
  </div>

  <div>
    <p v-if="loading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Suche Einträge
    </p>
    <div v-else>
      <span v-if="status">{{ status }}</span>
      <entry-list-items
        :items="items"
        :sort-function="sortByTitle"
        :options="{pagination: true}"
        v-else-if="items"
        :modifyRoute="modifyRoute">
      </entry-list-items>
    </div>
  </div>

</div>
</template>


<script>
import EntryListItems from '@/components/entry/list/EntryListItems'
import sortByTitle from '@/helpers/sort-by-title'
import SearchQuery from '@/resources/Search'
import Spinner from '@/components/Spinner'
import SearchField from '@/components/SearchField'

export default {
  props: ['modifyRoute'],
  data () {
    return {
      items: null,
      status: null,
      loading: false,
      sortByTitle,
      debounceTimeout: null,
      resetPageQueryParams: true,
      filterOptions: [
        { name: this.$t('status.any'), value: 'any' },
        { name: this.$t('entries.title'), value: 'title' },
        { name: this.$t('entries.short_description'), value: 'short_description' },
        { name: this.$t('entries.description'), value: 'description' },
        { name: this.$t('entries.address'), value: 'address' },
        { name: this.$t('headlines.contact'), value: 'contact_info' }
      ]
    }
  },

  created () {
    if (this.$route.query.keyword !== undefined && this.modifyRoute) {
      this.keyword = this.$route.query.keyword
      this.search(false)
    }
  },

  methods: {
    search (request) {
      this.loading = true
      this.status = this.$t('status.searching')
      SearchQuery.find(request).then(result => {
        this.status = result.length ? null : this.$t('status.noResults')
        this.items = result
        this.loading = false

        // reset page properties (page, size) after each manual search operation
        // but not initially to support hot linking and history.back
        const query = {...this.$route.query, keyword: this.keyword}
        if (this.resetPageQueryParams) {
          delete query.page
          delete query.pageSize
        }
        if (this.modifyRoute) {
          this.$router.push({query})
        }
      })
    },
    clearSearch () {
      this.items = null
      this.status = null
      this.loading = false
    },
    updateItems (request) {
      if (!request) {
        this.clearSearch()
      } else {
        this.search(request)
      }
    }
  },

  components: {
    EntryListItems,
    Spinner,
    SearchField
  }
}


</script>
