<template>
  <div :class="['entryList', {sideBarVisible}]">
    <afeefa-page>

      <afeefa-header slot="header">
        <div slot="title">
          {{ messages.headline() }} ({{ currentNumItems }})
        </div>

        <div slot="buttons">
          <router-link v-if="addEntryButton" :to="{name: addEntryButton}" class="btn green btn-medium">
            <i class="material-icons left">add</i>
            {{$t('buttons.add')}}
          </router-link>
        </div>
      </afeefa-header>

      <div slot="content">
        <slot></slot>

        <slot name="items">
          <entry-list-items
            :items="items"
            :isLoading="isLoading"
            :sort-function="sortFunction"
            :sort-order="sortOrder"
            :options="options">
          </entry-list-items>
        </slot>
      </div>

    </afeefa-page>

    <div v-if="showFilterBar || facetItemFilters.length">
      <div class="mainCard sidebar">
        <facet-item-filter-bar />
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Facet from '@/models/Facet'
import EntryListItems from '@/components/entry/EntryListItems'
import FacetItemFilterBar from '@/components/facet/FacetItemFilterBar'

export default {
  props: ['items', 'isLoading', 'numItems', 'facetEntryType', 'sortFunction', 'sortOrder', 'options', 'messages', 'addEntryButton'],

  created () {
    this.$store.dispatch('facetFilters/show', false)

    Facet.Query.getAll().then(facets => {
      this.$store.dispatch('facetFilters/initFacets', facets)
    })
  },

  computed: {
    ...mapState({
      showFilterBar: state => state.facetFilters.show,
      facetItemFilters: state => state.facetFilters.facetItemFilters
    }),

    sideBarVisible () {
      return this.showFilterBar || this.facetItemFilters.length
    },

    currentNumItems () {
      return this.numItems || this.items.length
    }
  },

  watch: {
    items () {
      this.$store.dispatch('facetFilters/initEntries', {type: this.facetEntryType, entries: this.items})
    }
  },

  components: {
    EntryListItems,
    FacetItemFilterBar
  }
}
</script>


<style lang="scss" scoped>
.entryList {
  .sidebar {
    position: fixed;
    width: 290px;
    // width: 100%;
    // height: auto;
    // margin: 2em 2em 20px 1em;
    // margin: 2em 3em auto 1em;
    margin-left: .5em;
  }
}

.entryList.sideBarVisible {
  display: flex;
  margin-right: calc(300px + 2em);

  > *:first-child {
    flex-grow: 1;
  }
}
</style>
