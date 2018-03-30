<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="container">
      <div class="mainCard__header">
        <slot name="header">
          <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>
          <h2 class="mainCard__headerTitle">{{ container.title || 'Kein Titel' }}</h2>
        </slot>
      </div>

      <div>
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

    <entry-loading-message v-else :error="hasItemLoadingError" :messages="messages" />
  </div>
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
