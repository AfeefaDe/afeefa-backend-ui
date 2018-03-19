<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="facetItem">
      <div class="mainCard__header">
        <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>
        <h2 class="mainCard__headerTitle">{{ facetItem.title || 'Kein Titel' }}</h2>
      </div>

      <div>
        <facet-item-owner-selector :facetItem="facetItem" />
      </div>
    </div>
  </div>
</div>
</template>


<script>
import Facet from '@/models/Facet'
import FacetItemOwnerSelector from '@/components/facet/FacetItemOwnerSelector'

export default {
  props: ['id', 'facetItemId'],

  data () {
    return {
      facetItem: null
    }
  },

  created () {
    this.loadFacetItem()
  },

  methods: {
    loadFacetItem () {
      Facet.Query.get(this.id).then(facet => {
        this.facetItem = facet.findFacetItem(this.facetItemId)
      })
    },

    goBack () {
      this.$router.go(-1)
    }
  },

  components: {
    FacetItemOwnerSelector
  }
}
</script>

<style lang="scss" scoped>
</style>
