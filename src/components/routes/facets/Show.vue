<template>
  <editable-tree-view
    :containerId="id"
    :routeConfig="treeConfig" />
</template>


<script>
import FacetTreeConfig from './FacetTreeConfig'
import EditableTreeView from '@/components/tree/EditableTreeView'

export default {
  props: ['id'],

  data () {
    return {
      treeConfig: new FacetTreeConfig(this, this.id)
    }
  },

  components: {
    EditableTreeView
  }
}
</script>
