<template>
  <div class="navigationBar" v-if="navigation">

    <tree-item-tag
      :treeItem="allNavigationItem"
      :chevron="true"
      :selected="allNavigationItem === selectedNavigationItem"
      @click="navigationItemClick(allNavigationItem)" />

    <div v-for="navigationItem in navigation.navigation_items" :key="navigationItem.id">
      <tree-item-tag
        :treeItem="navigationItem"
        :chevron="true"
        :countOwners="navigationItem[countAttributeName]"
        :selected="navigationItem === selectedNavigationItem"
        @click="navigationItemClick(navigationItem)" />

      <div v-for="(subItem, index) in navigationItem.sub_items" :key="subItem.id">
        <tree-sub-item :isLast="index === navigationItem.sub_items.length - 1">
          <tree-item-tag
          :treeItem="subItem"
          :chevron="true"
          :countOwners="subItem[countAttributeName]"
          :selected="subItem === selectedNavigationItem"
          @click="navigationItemClick(subItem)" />
        </tree-sub-item>
      </div>
    </div>

  </div>
</template>

<script>
import NavigationItem from '@/models/NavigationItem'
import TreeSubItem from '@/components/tree/TreeSubItem'

export default {
  props: ['navigation', 'countAttributeName', 'entries'],

  data () {
    return {
      allNavigationItem: null,
      selectedNavigationItem: null
    }
  },

  created () {
    const allNavigationItem = new NavigationItem()
    allNavigationItem.color = 'black'
    allNavigationItem.title = 'Alle'
    allNavigationItem.count_owners = this.entries.length
    allNavigationItem.count_owners_via_facet_items = this.entries.length
    allNavigationItem.count_direct_owners = this.entries.length
    this.allNavigationItem = allNavigationItem

    this.selectedNavigationItem = allNavigationItem
    this.$emit('select', allNavigationItem)
  },

  computed: {
  },

  methods: {
    navigationItemClick (navigationItem) {
      this.selectedNavigationItem = navigationItem
      this.$emit('select', this.selectedNavigationItem)
    }
  },

  components: {
    TreeSubItem
  }
}
</script>


<style lang="scss" scoped>
.treeItemTag {
  margin-bottom: .2em;
}
</style>
