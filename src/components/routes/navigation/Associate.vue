<template>
<afeefa-page>

  <afeefa-header slot="header">
    <div slot="title" v-if="navigationItem">
      {{ navigationItem.title }}
    </div>
  </afeefa-header>

  <div slot="content" v-if="navigationItem">
    <h4>{{ navigationItem.title }}</h4>

    <entry-facet-items :entry="navigationItem" :isEdit="true" />

    <navigation-item-owner-selector :navigationItem="navigationItem" />
  </div>

  <div slot="content" v-else>
    <entry-loading-message :error="hasItemLoadingError" :messages="loadingMessages" />
  </div>


</afeefa-page>
</template>


<script>
import Facet from '@/models/Facet'
import NavigationItem from '@/models/NavigationItem'

import NavigationItemOwnerSelector from '@/components/navigation/NavigationItemOwnerSelector'
import TreeItemTag from '@/components/tree/TreeItemTag'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryFacetItems from '@/components/entry/EntryFacetItems'

export default {
  props: ['id'],

  data () {
    return {
      navigationItem: null,
      facets: [],
      hasItemLoadingError: false,
      loadingMessages: {
        loadingItem: () => this.$t('status.load_navigation_item') + ' ' + this.id,
        loadingItemError: () => this.$t('errors.loadingNavigationItemError') + ' ' + this.id
      }
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
        if (navigationItem) {
          this.navigationItem = navigationItem
        } else {
          this.hasItemLoadingError = true
        }
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
    NavigationItemOwnerSelector,
    TreeItemTag,
    EntryLoadingMessage,
    EntryFacetItems
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
