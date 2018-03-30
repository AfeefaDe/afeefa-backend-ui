<template>
  <editable-tree-view containerId="app" :routeConfig="treeConfig">
    <h2 class="mainCard__headerTitle" slot="header">Navigation</h2>
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
