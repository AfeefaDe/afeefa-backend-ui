<template>
  <div>
    <afeefa-page :sideBar="sideBarVisible">

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

      <div slot="sidebar" v-if="sideBarVisible">
        <facet-item-filter-bar />
      </div>

    </afeefa-page>

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
