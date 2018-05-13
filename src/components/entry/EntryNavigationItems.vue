<template>
  <div v-if="navigation" class="entryNavigationItems">
    <a href="" @click.prevent="showNavigationEntry = !showNavigationEntry" v-if="!showNavigationEntry" class="inlineEditLink medium">In {{ countNavigationItems }} Navigationseinträgen</a>
    <div v-for="navigationItem in parentItems" :key="navigationItem.id" v-if="showNavigationEntry">
      <navigation-item-view :navigationItem="navigationItem" :countAttributeName="countAttributeName" />
      <div v-for="subItem in subItems[navigationItem.id]" :key="subItem.id">
        <navigation-item-view :navigationItem="subItem" :countAttributeName="countAttributeName" />
      </div>
    </div>

    <navigation-item-selector :owner="entry" v-if="isEdit" class="navigationItemSelectorLink" />
  </div>
</template>

<script>
import Navigation from '@/models/Navigation'
import NavigationItemView from '@/components/fe_navigation/FeNavigationItemView'
import NavigationItemSelector from '@/components/fe_navigation/FeNavigationItemSelector'

export default {
  props: ['entry', 'countAttributeName', 'isEdit'],

  data () {
    return {
      navigation: null,

      parentItems: [],
      subItems: {},
      countNavigationItems: 0,
      showNavigationEntry: true
    }
  },

  created () {
    Navigation.Query.get().then(navigation => {
      this.navigation = navigation

      this.initItems()
    })
  },

  methods: {
    initItems () {
      this.parentItems = this.getParentItems()
      this.countNavigationItems = this.parentItems.length

      this.parentItems.forEach(navigationItem => {
        this.subItems[navigationItem.id] = this.getSubItems(navigationItem)
        this.countNavigationItems += this.subItems[navigationItem.id].length
      })
    },

    getParentItems () {
      if (this.countAttributeName === 'count_owners_via_facet_items') {
        return this.navigation.navigation_items.filter(navigationItem => {
          return navigationItem.facet_items.some(facetItem => {
            return this.entry.facet_items.includes(facetItem)
          })
        })
      } else if (this.countAttributeName === 'count_direct_owners') {
        return this.navigation.navigation_items.filter(navigationItem => {
          return this.entry.navigation_items.includes(navigationItem)
        })
      } else {
        return this.navigation.navigation_items.filter(navigationItem => {
          return navigationItem.facet_items.some(facetItem => {
            return this.entry.facet_items.includes(facetItem)
          }) ||
          this.entry.navigation_items.includes(navigationItem)
        })
      }
    },

    getSubItems (navigationItem) {
      if (this.countAttributeName === 'count_owners_via_facet_items') {
        return navigationItem.sub_items.filter(subItem => {
          return subItem.facet_items.some(facetItem => {
            return this.entry.facet_items.includes(facetItem)
          })
        })
      } else if (this.countAttributeName === 'count_direct_owners') {
        return navigationItem.sub_items.filter(subItem => {
          return this.entry.navigation_items.includes(subItem)
        })
      } else {
        return navigationItem.sub_items.filter(subItem => {
          return subItem.facet_items.some(facetItem => {
            return this.entry.facet_items.includes(facetItem)
          }) ||
          this.entry.navigation_items.includes(subItem)
        })
      }
    }
  },

  components: {
    NavigationItemView,
    NavigationItemSelector
  }
}
</script>


<style lang="scss" scoped>
.entryNavigationItems {
  /deep/ .navigationItems {
    width: 100%;
    font-size: .9em;

    /deep/ .treeItemTag {
      margin-bottom: 3px;
    }
  }
}

</style>
