<template>
  <div slot="content" v-if="container">
    <div>
      <slot name="content"></slot>

      <div v-for="treeItem in this.treeItems" :key="treeItem.id">
        <tree-item-view
          :treeItem="treeItem"
          :routeConfig="routeConfig"
          :bus="bus"
          @update="loadTreeItems"
          @remove="loadTreeItems" />

        <div v-for="subTreeItem in treeItem.sub_items" :key="subTreeItem.id">
          <tree-item-view
            :treeItem="subTreeItem"
            :routeConfig="routeConfig"
            :bus="bus"
            @update="loadTreeItems"
            @remove="loadTreeItems" />
        </div>

        <tree-item-view
          :treeItem="createNewTreeItem(treeItem)"
          :routeConfig="routeConfig"
          :bus="bus"
          @update="loadTreeItems" />
      </div>

      <tree-item-view
        :treeItem="createNewTreeItem()"
        :routeConfig="routeConfig"
        :bus="bus"
        @update="loadTreeItems" />
    </div>
  </div>

  <div slot="content" v-else>
    <entry-loading-message :error="hasItemLoadingError" :messages="messages" />
  </div>
</template>


<script>
import Vue from 'vue'
import TreeItemView from './TreeItemView'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['containerId', 'routeConfig'],

  data () {
    return {
      container: null,
      treeItems: [],
      bus: new Vue(),
      hasItemLoadingError: false
    }
  },

  created () {
    this.loadContainer()
  },

  watch: {
    containerId () {
      this.loadContainer()
    }
  },

  methods: {
    createNewTreeItem (parent) {
      return this.routeConfig.createNewTreeItem(this.container, parent)
    },

    getTreeItems () {
      return this.routeConfig.getTreeItems(this.container)
    },

    loadTreeItems () {
      return this.routeConfig.loadTreeItems(this.container).then(treeItems => {
        this.treeItems = treeItems
      })
    },

    loadContainer () {
      this.Model.Query.get(this.containerId).then(container => {
        if (container) {
          this.container = container
          this.treeItems = this.getTreeItems()
        } else {
          this.hasItemLoadingError = true
        }
      })
    },

    goBack () {
      this.$router.go(-1)
    }
  },

  components: {
    TreeItemView,
    EntryLoadingMessage
  }
}
</script>
