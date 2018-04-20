<template>
  <div>
    <resource-item
      v-for="resourceItem in item.resource_items"
      :key="resourceItem.id"
      :resourceItem="resourceItem"
      @remove="removeResourceItem"
      :editEnabled="true">
    </resource-item>
    <div class="newResource">
      <div>
        <a href="" @click.prevent="addResourceItem"><i class="material-icons">add_circle</i></a>
      </div>
      <h2>
        Neue Ressource hinzufügen
      </h2>
    </div>
  </div>
</template>

<script>
import ResourceItem from '@/components/ResourceItem'
import ResourceItemModel from '@/models/ResourceItem'

export default {
  props: ['item'],

  methods: {
    addResourceItem () {
      let newResource = new ResourceItemModel()
      this.item.resource_items.push(newResource)
    },

    removeResourceItem (resourceItem) {
      const index = this.item.resource_items.indexOf(resourceItem)
      if (index !== -1) {
        this.item.resource_items.splice(index, 1)
      }
    }
  },

  components: {
    ResourceItem
  }
}
</script>

<style lang="scss" scoped>
  .newResource {
    text-align: center;
    margin-top: 1em;
    h2 {
      font-size: 1rem;
      margin-top: 0.3em;
    }
  }
</style>
