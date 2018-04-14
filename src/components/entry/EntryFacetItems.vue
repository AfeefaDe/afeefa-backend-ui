<template>
  <div>
    <div v-if="loading" >
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Kategorien
    </div>

    <div v-else>
      <span v-for="facet in facets" :key="facet.id">
        <span v-for="facetItem in getSelectedFacetItems(facet)" :key="facetItem.id">
          <tree-item-tag :treeItem="facetItem" />
        </span>
      </span>

      <facet-selector :owner="entry" @saved="facetsSaved" v-if="isEdit" class="facetSelectorLink" />
    </div>

  </div>
</template>

<script>
import TreeItemTag from '@/components/tree/TreeItemTag'
import FacetSelector from '@/components/facet/FacetSelector'
import Facet from '@/models/Facet'
import Spinner from '@/components/Spinner'

export default {
  props: ['entry', 'isEdit'],

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

  methods: {
    getSelectedFacetItems (facet) {
      return facet.getAllFacetItems().filter(item => {
        return this.entry.facet_items.includes(item)
      })
    },

    facetsSaved () {
      this.loading = true
      Promise.all([
        Facet.Query.getAll(),
        this.entry.$rels.facet_items.refetch()
      ]).then(result => {
        this.loading = false
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
</style>
