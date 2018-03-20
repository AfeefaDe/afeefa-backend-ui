<template>
  <ul class="facetItemTagList">
    <li v-for="facetItem in facetItems" :key="facetItem.id">
      <facet-item-tag :facetItem="facetItem" :link="{name: 'facetitem.associate', params: {id: facetItem.facet.id, facetItemId: facetItem.id}}" />
    </li>
  </ul>
</template>


<script>
import FacetItemTag from './FacetItemTag'

export default {
  props: ['facetItems'],

  components: {
    FacetItemTag
  }
}
</script>


<style lang="scss" scoped>
.facetItemTagList {
  margin: 0;

  li {
    display: inline-block;
    margin-right: .4em;
    margin-bottom: .4em;
  }
}
</style>
