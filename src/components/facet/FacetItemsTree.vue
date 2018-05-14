<template>
  <div class="facetItemsTree">
    <div class="facetSelector" ref="facetSelector" v-if="facets.length > 1">
      <facet-selector-item v-for="facet in facets" :key="facet.id" :ref="'facet' + facet.id"
        @click="openParentItemSelector(facet)"
        :item="facet"
        :color="facet.color"
        :selected="facet === selectedFacet"
        :more="true"
        :hint="numSelectedFacetItems(facet)" />
    </div>

    <div :class="['parentItemSelector', {isRoot: facets.length === 1}]" ref="parentItemSelector" v-if="selectedFacet">
      <facet-selector-item v-for="facetItem in selectedFacet.facet_items" :key="facetItem.id" :ref="'parentItem' + facetItem.id"
        @click="openSubItemSelector(facetItem)"
        :item="facetItem"
        :color="selectedFacet.color"
        :disabled="parentItemIsDisabled(facetItem)"
        :selected="facetItem === selectedParentItem"
        :more="facetHasSubItems(selectedFacet) && facetItem.sub_items.length"
        :hint="numSelectedSubItems(facetItem)" />
    </div>

    <div class="subItemSelector" ref="subItemSelector" v-if="selectedParentItem">
      <facet-selector-item
        @click="facetItemClick(selectedParentItem)"
        :item="selectedParentItem"
        :color="selectedFacet.color"
        :disabled="facetItemIsDisabled(selectedParentItem)"
        :more="false" />

      <div class="parentDivide" v-if="selectedParentItem.sub_items.length"></div>

      <facet-selector-item v-for="subItem in selectedParentItem.sub_items" :key="subItem.id"
        @click="facetItemClick(subItem)"
        :item="subItem"
        :color="selectedFacet.color"
        :disabled="facetItemIsDisabled(subItem)"
        :more="false" />
    </div>
  </div>
</template>

<script>
import facetItems from '@/helpers/facet-items'

export default {
  props: ['selectedFacetItems', 'facets'],

  data () {
    return {
      selectedFacet: null,
      selectedParentItem: null
    }
  },

  created () {
    if (this.facets.length === 1) {
      this.selectedFacet = this.facets[0]
    }
  },

  methods: {
    facetHasSubItems (facet) {
      return facet.facet_items.some(fi => fi.sub_items.length > 0)
    },

    parentItemIsDisabled (facetItem) {
      if (facetItem.sub_items.length) {
        return false
      }
      return this.selectedFacetItems.includes(facetItem)
    },

    facetItemIsDisabled (facetItem) {
      if (this.hasSelectedSubItem(facetItem)) {
        return false
      }
      return this.selectedFacetItems.includes(facetItem)
    },

    numSelectedFacetItems (facet) {
      return facetItems.getDisplayedFacetItemsByInsertion(this.selectedFacetItems, [facet]).length
    },

    numSelectedSubItems (facetItem) {
      if (!facetItem.sub_items.length) {
        return 0
      }

      const numSelectedSubItems = facetItem.sub_items.filter(subItem => this.selectedFacetItems.includes(subItem)).length
      if (numSelectedSubItems) {
        return numSelectedSubItems
      }

      return this.selectedFacetItems.includes(facetItem) ? 1 : 0
    },

    hasSelectedSubItem (facetItem) {
      return facetItem.sub_items.some(subItem => this.selectedFacetItems.includes(subItem))
    },

    openSubItemSelector (facetItem) {
      if (!facetItem.sub_items.length) {
        this.facetItemClick(facetItem)
        return
      }

      this.selectedParentItem = facetItem

      this.$nextTick(() => {
        const c = this.$refs.parentItemSelector
        const c2 = this.$refs['parentItem' + facetItem.id][0].$el
        const selector = this.$refs.subItemSelector

        const selectorX = this.facets.length === 1 ? 0 : c.offsetLeft
        const rootX = selectorX + c2.offsetLeft + c2.offsetWidth
        this.positionTree(selector, rootX, c.offsetTop + c2.offsetTop, 0, -10, c.offsetLeft)
      })
    },

    openParentItemSelector (facet) {
      this.selectedFacet = facet
      this.selectedParentItem = null

      this.$nextTick(() => {
        const c = this.$refs['facet' + facet.id][0].$el
        const selector = this.$refs.parentItemSelector
        this.positionTree(selector, c.offsetLeft + c.offsetWidth, c.offsetTop, 0, -10, 0)
      })
    },

    positionTree (tree, rootX, rootY, diffX, diffY, alternativeRootX) {
      tree.style.left = rootX + diffX + 'px'
      tree.style.top = rootY + diffY + 'px'

      const rect = tree.getBoundingClientRect()

      if (rect.right > window.innerWidth - 20) {
        let diff = rect.right - window.innerWidth + 20
        if (alternativeRootX !== undefined) {
          tree.style.left = alternativeRootX - rect.width + 'px'
        } else {
          tree.style.left = rootX - diff + 'px'
        }
      }

      if (rect.bottom > window.innerHeight - 20) {
        const diff = rect.bottom - window.innerHeight + 20
        tree.style.top = rootY - 10 - diff + 'px'
      }
    },

    facetItemClick (facetItem) {
      if (this.facetItemIsDisabled(facetItem)) {
        return
      }
      this.$emit('click', facetItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.facetItemsTree {
  padding: .5em;
}

.facetSelectorItem {
  font-size: .9em;

  /deep/ .facetItem {
    width: 100%;
  }

  &:not(:last-child) {
    margin-bottom: .2em;
  }
}

.parentDivide {
  margin: .3em 0 .4em;
  border-bottom: 1px solid $gray20;
}

.parentItemSelector:not(.isRoot), .subItemSelector {
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1em;
  margin-top: -.3em;

  background-color: white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.3), 0 2px 10px 0 rgba(0,0,0,0.3);
}

.parentItemSelector.isRoot {
  position: static;
}

.parentItemSelector.isRoot + .subItemSelector {
  margin-top: -1.3em;
}
</style>
