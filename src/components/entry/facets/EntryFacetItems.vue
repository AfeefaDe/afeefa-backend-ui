<template>
  <div :class="['entryFacetItems', {empty: !items.length}]">
    <div v-for="facetItem in items" :key="facetItem.id" class="entryFacetItem">
      <tree-item-tag
        v-if="selectable"
        :treeItem="facetItem"
        :x="true"
        @click="facetItemClick" />

      <tree-item-tag v-else :treeItem="facetItem" />
    </div>

    <slot name="buttons" />
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'

export default {
  props: ['items', 'selectable', 'sortByInsertion'],

  methods: {
    facetItemClick (facetItem) {
      this.$emit('click', facetItem)
    }
  },

  components: {
    Spinner
  }
}
</script>


<style lang="scss" scoped>
.entryFacetItems {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 1.8em;
}

.treeItemTag {
  margin-right: .4em;
  margin-bottom: .4em;
}
</style>
