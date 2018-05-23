<template>
  <div class="navigationItemsTree" v-if="navigation">
    <div class="parentItemSelector" ref="parentItemSelector">
      <facet-selector-item v-for="navigationItem in navigation.navigation_items" :key="navigationItem.id" :ref="'parentItem' + navigationItem.id"
        @click="openSubItemSelector(navigationItem)"
        :item="navigationItem"
        :color="navigationItem.color"
        :disabled="parentItemIsDisabled(navigationItem)"
        :selected="navigationItem === selectedParentItem"
        :more="navigationItem.sub_items.length"
        :hint="numSelectedSubItems(navigationItem)" />
    </div>

    <div class="subItemSelector" ref="subItemSelector" v-if="selectedParentItem">
      <facet-selector-item
        @click="navigationItemClick(selectedParentItem)"
        :item="selectedParentItem"
        :color="selectedParentItem.color"
        :disabled="navigationItemIsDisabled(selectedParentItem)"
        :more="false" />

      <div class="parentDivide" v-if="selectedParentItem.sub_items.length"></div>

      <facet-selector-item v-for="subItem in selectedParentItem.sub_items" :key="subItem.id"
        @click="navigationItemClick(subItem)"
        :item="subItem"
        :color="selectedParentItem.color"
        :disabled="navigationItemIsDisabled(subItem)"
        :more="false" />
    </div>
  </div>
</template>

<script>
import Navigation from '@/models/Navigation'
import { mapState } from 'vuex'

export default {
  props: ['selectedFacetItems', 'facets', 'more'],

  data () {
    return {
      navigation: null,
      selectedParentItem: null
    }
  },

  created () {
    Navigation.Query.get().then(navigation => {
      this.navigation = navigation
    })
  },

  computed: {
    ...mapState({
      navigationIsSelected: state => state.facetFilters.navigationIsSelected,
      selectedNavigationItem: state => state.facetFilters.selectedNavigationItem
    })
  },

  methods: {
    parentItemIsDisabled (navigationItem) {
      if (navigationItem.sub_items.length) {
        return false
      }
      return this.selectedNavigationItem === navigationItem
    },

    navigationItemIsDisabled (navigationItem) {
      return this.selectedNavigationItem === navigationItem
    },

    numSelectedSubItems (navigationItem) {
      if (!navigationItem.sub_items.length) {
        return 0
      }

      if (!this.selectedNavigationItem) {
        return 0
      }

      return this.selectedNavigationItem === navigationItem.parent ? 1 : 0
    },

    openSubItemSelector (navigationItem) {
      if (!navigationItem.sub_items.length) {
        this.navigationItemClick(navigationItem)
        return
      }

      this.selectedParentItem = navigationItem

      this.$nextTick(() => {
        const c = this.$refs.parentItemSelector
        const c2 = this.$refs['parentItem' + navigationItem.id][0].$el
        const selector = this.$refs.subItemSelector

        const selectorX = c.offsetLeft
        const rootX = selectorX + c2.offsetLeft + c2.offsetWidth
        this.positionTree(selector, rootX, c.offsetTop + c2.offsetTop, 0, -10, c.offsetLeft)
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

    navigationItemClick (facetItem) {
      if (this.navigationItemIsDisabled(facetItem)) {
        return
      }
      this.$emit('click', facetItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.navigationItemsTree {
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

.parentItemSelector {
  position: static;
}

.parentItemSelector + .subItemSelector {
  margin-top: -1.3em;
}
</style>
