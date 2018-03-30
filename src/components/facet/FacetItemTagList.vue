<template>
  <ul class="facetItemTagList">
    <li v-for="facetItem in facetItems" :key="facetItem.id"
      :class="{parentItem: !facetItem.parent, subItem: facetItem.parent}">
      <tree-item-tag
        :treeItem="facetItem"
        :link="{name: 'facetitem.associate', params: {id: facetItem.facet.id, facetItemId: facetItem.id}}" />
    </li>
  </ul>
</template>


<script>
import TreeItemTag from '@/components/tree/TreeItemTag'

export default {
  props: ['facetItems'],

  components: {
    TreeItemTag
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
