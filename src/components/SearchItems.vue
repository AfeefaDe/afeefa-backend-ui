<template>
<div>
  <div class="searchBar">
    <div class="searchFilter">
      <label class="typo__label">{{ $t('infos.search_field')}}</label>
      <multiselect v-model="filterCriterion" @input="filterChanged" :options="filterOptions" :allow-empty="false" :searchable="false" :close-on-select="true" :show-labels="false" label="name"></multiselect>
    </div>

    <div class="searchFormContainer">
      <div class="searchForm">
        <form autocomplete="off" @submit.prevent="search" class="searchForm">
          <div class="input-field searchForm__input">
            <input autofocus :class="[{active: keyword}, 'validate']" type="text" id="searchterm" ref="search" v-model="keyword" @input="livesearch">
            <label for="searchterm">{{$t('headlines.searchPlaceholder')}}</label>
          </div>
        </form>
      </div>

      <div class="searchButtons">
        <a v-if="keyword" @click.prevent="clearSearch" href="#"><i class="material-icons searchForm__icon">cancel</i></a>
        <button class="btn waves-effect waves-light hideDesktop" type="submit">{{$t('buttons.search')}}</button>
      </div>
    </div>

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
        :typeFilter="typeFilter"
        :options="{pagination: true}"
        v-else-if="items"
        :modifyRoute="modifyRoute">
      </entry-list-items>
    </div>
  </div>

</div>
</template>


<script>
import EntryListItems from '@/components/EntryListItems'
import sortByTitle from '@/helpers/sort-by-title'
import Search from '@/resources/Search'
import Spinner from '@/components/Spinner'
import Multiselect from 'vue-multiselect'

export default {
  props: ['modifyRoute', 'typeFilter'],
  data () {
    return {
      items: null,
      status: null,
      keyword: '',
      sortByTitle,
      loading: false,
      debounceTimeout: null,
      filterCriterion: { name: this.$t('entries.title'), value: 'title' },
      filterOptions: [
        { name: this.$t('entries.title'), value: 'title' },
        { name: this.$t('entries.short_description'), value: 'short_description' },
        { name: this.$t('entries.description'), value: 'description' },
        { name: this.$t('entries.id'), value: 'id' }
      ]
    }
  },

  created () {
    if (this.$route.query.keyword !== undefined && this.modifyRoute) {
      this.keyword = this.$route.query.keyword
      this.search(false)
    }
  },

  watch: {
    'keyword': function (keyword) {
      if (keyword.length === 0) {
        this.clearSearch()
      }
    }
  },

  methods: {
    search (resetPageQueryParams = true) {
      if (this.keyWordIsValid()) {
        this.loading = true
        this.status = 'Suche Einträge'
        Search.find([{keyword: this.keyword, filterCriterion: this.filterCriterion.value}]).then(result => {
          this.status = result.length ? null : '0 Ergebnisse'
          this.items = result
          this.loading = false

          // reset page properties (page, size) after each manual search operation
          // but not initially to support hot linking and history.back
          const query = {...this.$route.query, keyword: this.keyword}
          if (resetPageQueryParams) {
            query.page = undefined
            query.pageSize = undefined
          }
          if (this.modifyRoute) {
            this.$router.push({query})
          }
        })
      }
    },
    clearSearch () {
      this.items = null
      this.keyword = ''
      this.status = null
      this.loading = false
    },

    livesearch () {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }

      this.debounceTimeout = setTimeout(() => {
        if (this.keyWordIsValid()) {
          this.search()
        }
      }, 400)
    },

    keyWordIsValid () {
      return this.keyword.length >= 2 && this.keyword.trim().length > 0
    },

    filterChanged () {
      this.search()
    }
  },

  computed: {
    numResultsString () {
      return this.items ? `(${this.items.length} Treffer)` : ''
    }
  },

  components: {
    EntryListItems,
    Spinner,
    Multiselect
  }
}


</script>


<style lang="scss" scoped>
@import "~variables";

.searchForm {
  flex-grow: 1;
  &__input {
    input {
      margin-bottom: 1em;
    }
  }
  &__icon {
    color: $black;
    margin-right: 20px;
  }
}

.searchFormContainer {
  flex-grow: 2;
  display: flex;
  flex-wrap: nowrap;
  margin-right: 20px;
}

.searchButtons {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  /*margin-right: 5px;*/
  flex-grow: 1;
  button {
    margin-left: 10px;
  }
}

.searchBar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.searchFilter {
  width: 16em;
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
