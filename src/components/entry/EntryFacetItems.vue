<template>
  <div>
    <div v-if="loading" >
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Kategorien
    </div>

    <div v-else>
      <span v-for="facet in facets" :key="facet.id" v-if="entry.facet_items.length">
        <span v-for="facetItem in getSelectedFacetItems(facet)" :key="facetItem.id">
          <span v-if="useFacetFilter" @click="facetItemClick(facetItem)" :class="{clickable: useFacetFilter}">
            <tree-item-tag
              :treeItem="facetItem"
              :countOwners="countEntriesForFacetItem(facetItem)"
              :x="facetItemIsSelected(facetItem)" />
          </span>
          <tree-item-tag :treeItem="facetItem" v-else />
        </span>
      </span>

      <facet-selector :owner="entry" @saved="facetsSaved" v-if="isEdit" class="facetSelectorLink" />
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import TreeItemTag from '@/components/tree/TreeItemTag'
import FacetSelector from '@/components/facet/FacetSelector'
import Facet from '@/models/Facet'
import Spinner from '@/components/Spinner'
import facetItems from '@/helpers/facet-items'

export default {
  props: ['entry', 'isEdit', 'useFacetFilter'],

  data () {
    return {
      facets: [],
      loading: false
    }
  },

  created () {
    Facet.Query.getAll().then(facets => {
      this.facets = facets
    })
  },

  computed: {
    ...mapState({
      selectedFacetItems: state => state.facetFilters.selectedFacetItems,
      filteredEntries: state => state.facetFilters.filteredEntries
    })
  },

  methods: {
    facetItemClick (facetItem) {
      this.$store.dispatch('facetFilters/filteredFacetItemClick', facetItem)
    },

    countEntriesForFacetItem (facetItem) {
      return facetItems.getEntriesForFacetItem(facetItem, this.filteredEntries).length
    },

    getSelectedFacetItems (facet) {
      return facet.getAllFacetItems().filter(item => {
        return this.entry.facet_items.includes(item)
      })
    },

    facetItemIsSelected (facetItem) {
      return this.selectedFacetItems.includes(facetItem)
    },

    facetsSaved () {
      this.loading = true
      Promise.all([
        Facet.Query.getAll(),
        this.entry.$rels.facet_items.refetch()
      ]).then(result => {
        this.loading = false

        if (this.useFacetFilter) {
          this.$store.dispatch('facetFilters/entryFacetItemsChanged')
        }
      })
    }
  },

  components: {
    TreeItemTag,
    FacetSelector,
    Spinner
  }
}
</script>


<style lang="scss" scoped>
.facetSelectorLink {
  display: inline-block;
}

.treeItemTag {
  display: inline-block;
  margin-right: .4em;
  margin-bottom: .4em;
}

.clickable {
  cursor: pointer;
}
</style>
