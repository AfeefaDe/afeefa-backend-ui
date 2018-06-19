<template>
  <div>
    <tree-item-tag :treeItem="treeItem" :chevron="routeConfig.chevron" :count="false" />

    <a href="" @click.prevent="cancel()" class="inlineEditLink">
      Abbrechen
    </a>

    <a href="" @click.prevent="move()" v-if="item.id && canMove && !isMove" class="inlineEditLink">
      Verschieben
    </a>
    <a href="" @click.prevent="edit()" v-if="isMove" class="inlineEditLink">
      Ändern
    </a>

    <a href="" @click.prevent="remove()" class="inlineEditLink">
      Löschen
    </a>

    <div class="editorForm">
      <tree-item-editor-form
        v-if="!isMove"
        :item="treeItem"
        :hasAttributes="true"
        :hasColor="canColorize"
        @update="update"
        @cancel="cancel" />

      <tree-item-editor-form
        v-else
        :item="treeItem"
        :hasMove="true"
        @update="update"
        @cancel="cancel">
        <select class="browser-default" v-model="treeItem.parent" v-if="canSelectSubItems()">
          <option :value="null">Attribut auswählen</option>
          <option :value="parentItem" v-for="parentItem in parentItems" :key="parentItem.id">{{ parentItem.title }}</option>
        </select>

        <button type="button" class="btn btn-small" @click="update()">
          <i class="material-icons left">done</i>
        </button>
      </tree-item-editor-form>
    </div>
  </div>
</template>

<script>
import TreeItemEditorForm from './TreeItemEditorForm'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  props: ['item', 'routeConfig'],

  data () {
    return {
      treeItem: null,
      parentItems: [],
      isMove: false
    }
  },

  created () {
    this.treeItem = this.item.clone()
    this.parentItems = this.getContainerTreeItems()
  },

  watch: {
    'treeItem.color' () {
      this.item.previewColor = this.treeItem.color
    }
  },

  computed: {
    canMove () {
      return !this.item.sub_items.length
    },

    canColorize () {
      return this.routeConfig.canColorizeItems && !this.treeItem.parent
    }
  },

  methods: {
    getContainerTreeItems () {
      const container = this.item.container
      return this.routeConfig.getTreeItems(container)
    },

    edit () {
      this.treeItem = this.item.clone()
      this.isMove = false
    },

    move () {
      this.treeItem = this.item.clone()
      this.isMove = true
    },

    canSelectSubItems () {
      if (this.treeItem.sub_items.length) {
        return false
      }

      return true
    },

    cancel () {
      this.item.previewColor = null
      this.$emit('cancel', this.treeItem)
    },

    remove () {
      this.$emit('remove', this.treeItem)
    },

    update () {
      this.$emit('update', this.treeItem)
    }
  },

  components: {
    TreeItemEditorForm,
    ColorPicker: Swatches
  }
}
</script>

<style lang="scss" scoped>
.editorForm {
  margin-top: 2px;
}

.inlineEditLink {
  margin-left: 6px;
}
</style>
