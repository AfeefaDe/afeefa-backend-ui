<template>
  <div class="filterBar">
    <div class="controls">
      <div class="controls__left">
        <div class="inputContainer">
          <input
            class="browser-default"
            type="text"
            placeholder="Tippen zum Filtern"
            v-model="searchKeyword"
            @keydown.esc.prevent="searchKeyword = ''" />
          <a v-if="searchKeyword" @click.prevent="searchKeyword = ''" href="">
            <i class="material-icons">cancel</i>
          </a>
        </div>

        <sort-order-selector v-if="has.sort" :customSortOrders="customSortOrders" @change="sortOrderChanged" />

        <filter-icons icon="facets" v-if="has.facets" class="facetsFilterIcons" />
      </div>

      <div class="controls__right">
        <slot name="customFilter" />

        <filter-icons icon="filters" v-if="has.facets" class="facetsFilterIcons" @filterClick="setFilterSelectorVisibility" />
      </div>
    </div>

    <selected-filters v-if="showSelectedFilters" class="selectedListFilters" />
  </div>
</template>

<script>
import SelectedFilters from './SelectedFilters'
import FilterIcons from './FilterIcons'
import SortOrderSelector from './SortOrderSelector'
import FacetSelector from './FacetSelector'
import { mapState } from 'vuex'

export default {
  props: ['entries', 'customSortOrders', 'options'],

  data () {
    const options = this.options || {}
    return {
      searchKeyword: null,
      filterSelectorOpen: false,

      has: {
        active: options.active,
        sort: options.sort,
        facets: options.facets,
        liveSearch: options.liveSearch
      }
    }
  },

  watch: {
    'searchKeyword' () {
      this.$emit('keyword', this.searchKeyword)
    },

    'filteredEntries' (newItems, oldItems) {
      if (oldItems.length) {
        this.searchKeyword = ''
      }
      this.$emit('filter')
    }
  },

  computed: {
    ...mapState({
      filteredEntries: state => state.entryListFilters.filteredEntries,
      selectedActiveState: state => state.entryListFilters.selectedActiveState,
      selectedNavigationItem: state => state.entryListFilters.selectedNavigationItem,
      facetItemFilters: state => state.entryListFilters.facetItemFilters
    }),

    showFilters () {
      return this.has.facets && (this.filterSelectorOpen || this.showSelectedFilters)
    },

    showSelectedFilters () {
      return this.selectedActiveState.value !== 'all' || this.facetItemFilters.length || this.selectedNavigationItem
    }
  },

  methods: {
    sortOrderChanged (sortOrder) {
      this.$emit('sortOrder', sortOrder)
    },

    setFilterSelectorVisibility (isOpen) {
      this.filterSelectorOpen = !this.filterSelectorOpen
    }
  },

  components: {
    SelectedFilters,
    FilterIcons,
    SortOrderSelector,
    FacetSelector
  }
}
</script>

<style lang="scss" scoped>
.filterBar {
  width: 100%;

  .controls {
    display: flex;
    align-items: center;

    > * {
      display: flex;
      align-items: center;
    }

    &__left {
      flex-grow: 1;
    }
  }

  .inputContainer {
    &:not(:first-child) {
      margin-left: .5em;
    }
    position: relative;
  }

  input {
    padding-right: 2em;
    width: 200px;
  }

  input, /deep/ select {
    height: 2em;
    padding: 0 .4em;
  }

  a {
    position: absolute;
    top: .35em;
    right: .35em;
  }

  i {
    color: $gray80;
    font-size: 18px;
  }

  .sortOrderSelector {
    margin-left: .5em;
  }

  .facetsFilterIcons {
    margin-top: .2em;
    height: 1em;

    &:not(.empty) {
      margin-left: .8em;
    }
  }

  .selectedListFilters {
    margin-top: .8em;
    margin-bottom: -.4em;
  }

  .filterSelector {
    margin-bottom: .8em;
  }
}
</style>
