<template>
  <div>
    <a ref="trigger" href="" @click.prevent="showFacetSelector">
      <slot />
    </a>

    <pop-up-selector :trigger="$refs.trigger" @close="hideFacetSelector" v-if="facetItemSelectorVisible">
      <facet-items-tree
        :facets="facets"
        :selectedFacetItems="selectedFacetItems"
        @close="hideFacetSelector"
        @click="facetItemClick" />
    </pop-up-selector>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PopUpSelector from '@/components/PopUpSelector'
import FacetItemsTree from '@/components/facet/FacetItemsTree'

export default {
  props: ['facets', 'selectedFacetItems'],

  data () {
    return {
      facetItemSelectorVisible: false
    }
  },

  computed: {
    ...mapGetters('facetFilters', ['selectableFacets']),

    ...mapState({
      selectedFacets: state => state.facetFilters.selectedFacets
    })
  },

  methods: {
    showFacetSelector () {
      this.facetItemSelectorVisible = true
    },

    facetItemClick (facetItem) {
      this.$emit('click', facetItem)
      this.hideFacetSelector()
    },

    hideFacetSelector () {
      this.facetItemSelectorVisible = false
    },

    selectOrDeselectFacet (facet) {
      this.$store.dispatch('facetFilters/selectOrDeselectFacet', facet)
    }
  },

  components: {
    PopUpSelector,
    FacetItemsTree
  }
}
</script>

<style lang="scss" scoped>
.facetSelectorItem {
  margin-bottom: .2em;

  /deep/ .facetItem {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
