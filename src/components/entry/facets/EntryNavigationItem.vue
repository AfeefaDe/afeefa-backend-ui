<template>
  <div class="navigationItems">
    <tree-item-tag v-if="navigationItem.parent"
      :treeItem="navigationItem.parent"
      :x="x"
      :chevron="true"
      :click="click"
      @click="onClick" />

    <tree-item-tag
      :treeItem="navigationItem"
      :x="x"
      :chevron="true"
      :click="click"
      @click="onClick" />
  </div>
</template>


<script>
export default {
  props: ['navigationItem', 'x', 'click'],

  computed: {
    color () {
      return this.navigationItem.parent ? this.navigationItem.parent.color : this.navigationItem.color
    }
  },

  methods: {
    onClick (navigationItem) {
      this.$emit('click', navigationItem)
    }
  }
}
</script>


<style lang="scss" scoped>
.navigationItems {
  // font-size: 1.2em;
  display: flex;

  .treeItemTag + .treeItemTag {
    margin-left: .6em;
  }
}
</style>
