<template>
  <div class="selectedListFilters">
    <tree-item-tag v-if="selectedActiveState.value !== 'all'"
      class="facetFilterTag"
      :treeItem="{title: selectedActiveState.name, color: '#F2F2F2'}"
      :x="true"
      @click="activeStateClick" />

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
import { mapState } from 'vuex'
import EntryNavigationItem from '@/components/entry/facets/EntryNavigationItem'

export default {
  computed: {
    ...mapState({
      selectedActiveState: state => state.entryListFilters.selectedActiveState,
      selectedNavigationItem: state => state.entryListFilters.selectedNavigationItem,
      facetItemFilters: state => state.entryListFilters.facetItemFilters
    })
  },

  methods: {
    facetItemClick (facetItem) {
      this.$store.dispatch('entryListFilters/filteredFacetItemClick', facetItem)
    },

    navigationItemClick (navigationItem) {
      this.$store.dispatch('entryListFilters/selectOrDeselectNavigationItem', navigationItem)
    },

    activeStateClick () {
      this.$store.dispatch('entryListFilters/unsetActiveState')
    }
  },

  components: {
    EntryNavigationItem
  }
}
</script>


<style lang="scss" scoped>
.selectedListFilters {
  display: flex;
}

.treeItemTag.facetFilterTag {
  font-size: .9em;
  margin-right: .5em;
  margin-bottom: .4em;
}

.navigationItems {
  /deep/ .treeItemTag {
    font-size: .9em;
    margin-bottom: .4em;
  }
}
</style>
