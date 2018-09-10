<template>
  <div>
    <a ref="trigger" href="" @click.prevent="showFacetSelector($event.currentTarget)" v-if="!hideAddLink">
      <slot />
    </a>

    <pop-up-selector :trigger="customTrigger || $refs.trigger" diffX="0" @close="hideFacetSelector" v-if="facetItemSelectorVisible">
      <facet-item-selector-content
        :facets="facets"
        :selectedFacetItems="selectedFacetItems"
        @close="hideFacetSelector"
        @click="facetItemClick" />
    </pop-up-selector>
  </div>

</template>

<script>
import PopUpSelector from '@/components/PopUpSelector'
import FacetItemSelectorContent from '@/components/facet/FacetItemSelectorContent'

export default {
  props: ['facets', 'selectedFacetItems', 'hideAddLink'],

  data () {
    return {
      facetItemSelectorVisible: false,
      customTrigger: null
    }
  },

  methods: {
    showFacetSelector (customTrigger) {
      this.customTrigger = customTrigger
      this.facetItemSelectorVisible = true
    },

    facetItemClick (facetItem) {
      this.$emit('click', facetItem)
      this.hideFacetSelector()
    },

    hideFacetSelector () {
      this.facetItemSelectorVisible = false
    }
  },

  components: {
    PopUpSelector,
    FacetItemSelectorContent
  }
}
</script>

