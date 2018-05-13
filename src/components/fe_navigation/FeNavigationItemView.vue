<template>
  <div class="navigationItems">
    <tree-item-tag v-if="navigationItem.parent"
      :treeItem="navigationItem.parent"
      :countOwners="navigationItem.parent[countAttributeName]"
      :chevron="true" />

    <tree-item-tag
      :treeItem="navigationItem"
      :countOwners="navigationItem[countAttributeName]"
      :chevron="true" />
  </div>

</template>


<script>
export default {
  props: ['navigationItem', 'countAttributeName'],

  computed: {
    color () {
      return this.navigationItem.parent ? this.navigationItem.parent.color : this.navigationItem.color
    }
  }
}
</script>


<style lang="scss" scoped>
.navigationItems {
  font-size: 1.2em;
  display: flex;

  .treeItemTag + .treeItemTag {
    margin-left: .6em;
  }
}
</style>
