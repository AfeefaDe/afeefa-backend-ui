<template>
  <editable-tree-view containerId="app" :routeConfig="treeConfig">
    <span slot="header">Navigation</span>
  </editable-tree-view>
</template>


<script>
import NavigationTreeConfig from './NavigationTreeConfig'
import EditableTreeView from '@/components/tree/EditableTreeView'

export default {
  data () {
    return {
      treeConfig: new NavigationTreeConfig(this)
    }
  },

  components: {
    EditableTreeView
  }
}
</script>
