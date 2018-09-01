<template>
  <div class="facetItems">
    <tree-item-tag v-for="facetItem in facetItemFilters" :key="facetItem.id"
      class="facetFilterTag"
      :treeItem="facetItem"
      :x="true"
      @click="facetItemClick(facetItem)" />

    <entry-navigation-item
      :navigationItem="selectedNavigationItem"
      v-if="selectedNavigationItem"
      :x="true"
      @click="navigationItemClick" />
  </div>

</template>


<script>
import Facet from '@/models/Facet'
import { mapState } from 'vuex'
import EntryNavigationItem from '@/components/entry/facets/EntryNavigationItem'

export default {
  created () {
    Facet.Query.getAll().then(facets => {
      this.$store.dispatch('facetFilters/initFacets', facets)
    })
  },

  computed: {
    ...mapState({
      selectedNavigationItem: state => state.facetFilters.selectedNavigationItem,

      facetItemFilters: state => state.facetFilters.facetItemFilters
    })
  },

  methods: {
    facetItemClick (facetItem) {
      this.$store.dispatch('facetFilters/filteredFacetItemClick', facetItem)
    },

    navigationItemClick (navigationItem) {
      this.$store.dispatch('facetFilters/selectOrDeselectNavigationItem', navigationItem)
    }
  },

  components: {
    EntryNavigationItem
  }
}
</script>


<style lang="scss" scoped>
.facetItems {
  display: flex;
}

.treeItemTag.facetFilterTag {
  font-size: 1.1em;
  margin-right: .5em;
  margin-bottom: .4em;
}

.navigationItems {
  /deep/ .treeItemTag {
    font-size: 1.1em;
    margin-bottom: .4em;
  }
}
</style>
