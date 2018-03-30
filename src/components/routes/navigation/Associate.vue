<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="navigationItem">
      <div class="mainCard__header">
        <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>
        <span v-if="navigationItem.parent">
          <router-link :to="{name: 'navigation.associate', params: {id: navigationItem.parent.id}}">
            <h2 class="mainCard__headerTitle parentItemHeader">{{ navigationItem.parent.title }}</h2>
          </router-link>
          <i class="material-icons">chevron_left</i>
        </span>
        <h2 class="mainCard__headerTitle">{{ navigationItem.title }}</h2>
      </div>

      <div>
        <h4>{{ navigationItem.title }}</h4>

        <span v-for="facet in facets" :key="facet.id">
          <span v-for="facetItem in getSelectedFacetItems(facet)" :key="facetItem.id">
            <tree-item-tag :treeItem="facetItem" />
          </span>
          <navigation-item-facet-selector :navigationItem="navigationItem" :facet="facet" />
        </span>

        <navigation-item-owner-selector :navigationItem="navigationItem" />
      </div>
    </div>
  </div>
</div>
</template>


<script>
import Facet from '@/models/Facet'
import NavigationItem from '@/models/NavigationItem'

import NavigationItemOwnerSelector from '@/components/navigation/NavigationItemOwnerSelector'
import NavigationItemFacetSelector from '@/components/navigation/NavigationItemFacetSelector'
import TreeItemTag from '@/components/tree/TreeItemTag'

export default {
  props: ['id'],

  data () {
    return {
      navigationItem: null,
      facets: []
    }
  },

  created () {
    this.loadNavigationItem(this.id)

    Facet.Query.getAll().then(facets => {
      this.facets = facets
    })
  },

  methods: {
    getSelectedFacetItems (facet) {
      return facet.getAllFacetItems().filter(item => {
        return this.navigationItem.facet_items.includes(item)
      })
    },

    loadNavigationItem (id) {
      NavigationItem.Query.get(id).then(navigationItem => {
        console.log(navigationItem)
        this.navigationItem = navigationItem
      })
    },

    goBack () {
      this.$router.go(-1)
    }
  },

  beforeRouteUpdate (to, from, next) {
    if (this.id !== to.params.id) {
      this.loadNavigationItem(to.params.id)
    }
    next()
  },

  components: {
    NavigationItemFacetSelector,
    NavigationItemOwnerSelector,
    TreeItemTag
  }
}
</script>

<style lang="scss" scoped>
.treeItemTag {
  display: inline-block;
  margin: .4em .4em .4em 0;
}

h4 {
  font-size: 2em;
  line-height: 1.4em;
  margin: 0;
}

.parentItemHeader {
  display: inline-block;
  margin: 0;
  padding: 0;
}
</style>
