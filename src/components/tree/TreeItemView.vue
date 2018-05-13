<template>
  <div class="treeItemContainer">
    <div v-if="treeItem.id" :class="['treeItem', {parentItem: !treeItem.parent, subItem: treeItem.parent, editItem: isEdit}]">
      <div>
        <tree-item-tag :treeItem="treeItem" :chevron="routeConfig.chevron" v-if="!isEdit" />

        <span v-if="!isEdit">
          <a href="" @click.prevent="edit()" class="inlineEditLink">
            Ändern
          </a>
        </span>

        <tree-item-editor
          v-if="isEdit"
          class="editor"
          :item="treeItem"
          :routeConfig="routeConfig"
          @cancel="cancel"
          @update="update"
          @remove="remove" />
      </div>
    </div>

    <div v-else :class="['treeItem', 'lastItem', {parentItem: !treeItem.parent, subItem: treeItem.parent, editItem: isEdit}]">
      <div>
        <div>
          <a href="" @click.prevent="edit()" v-if="!isEdit" class="inlineEditLink">
            Hinzufügen
          </a>
          <tree-item-editor
            v-if="isEdit"
            class="editor"
            :item="treeItem"
            :routeConfig="routeConfig"
            @cancel="cancel"
            @update="update"
            @remove="remove" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import TreeItemEditor from './TreeItemEditor'

export default {
  props: ['treeItem', 'routeConfig', 'bus'],

  data () {
    return {
      isEdit: false
    }
  },

  created () {
    this.bus.$on('edit', this.checkCancel)
  },

  destroyed () {
    this.bus.$off('edit', this.checkCancel)
  },

  methods: {
    checkCancel (treeItem) {
      if (treeItem !== this.treeItem) {
        this.cancel()
      }
    },

    edit () {
      this.isEdit = true
      this.bus.$emit('edit', this.treeItem)

      this.$nextTick(() => {
        const elBottom = this.$el.offsetTop + this.$el.offsetHeight
        const scrollBottom = window.scrollY + window.innerHeight
        if (elBottom > scrollBottom) {
          window.scrollTo(0, window.scrollY + (elBottom - scrollBottom) + 10)
        }
      })
    },

    cancel () {
      this.treeItem.previewColor = null
      this.isEdit = false
    },

    getContainerTreeItemsRelation () {
      const container = this.treeItem.container
      return this.routeConfig.getTreeItemsRelation(container)
    },

    getContainerTreeItems () {
      const container = this.treeItem.container
      return this.routeConfig.getTreeItems(container)
    },

    update (treeItemToSave) {
      this.getContainerTreeItemsRelation().Query.save(treeItemToSave).then(savedTreeItem => {
        if (savedTreeItem) {
          // tmp add item to parent in order to fill the
          // delay/gap until the container items are reloaded again
          if (!treeItemToSave.id) {
            if (treeItemToSave.parent) {
              treeItemToSave.parent.sub_items.push(savedTreeItem)
            } else {
              this.getContainerTreeItems().push(savedTreeItem)
            }
          }

          this.$store.dispatch('messages/showAlert', {
            description: 'Das Attribut wurde geändert.'
          })

          this.cancel()
          this.$emit('update')
        }
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: `Attribut ${this.treeItem.title} löschen`,
        message: 'Soll das Attribut gelöscht werden?\n\nAlle Akteure verlieren dieses Attribut.'
      }).then(result => {
        if (result === 'yes') {
          this.getContainerTreeItemsRelation().Query.delete(this.treeItem).then(deleted => {
            if (deleted) {
              // tmp add item to parent in order to fill the
              // delay/gap until the container items are reloaded again
              const items = this.treeItem.parent ? this.treeItem.parent.sub_items : this.getContainerTreeItems()
              const index = items.indexOf(this.treeItem)
              items.splice(index, 1)

              this.$store.dispatch('messages/showAlert', {
                description: 'Das Attribut wurde gelöscht'
              })

              this.cancel()
              this.$emit('remove')
            }
          })
        }
      })
    }
  },

  components: {
    TreeItemEditor
  }
}
</script>


<style lang="scss" scoped>
.inlineEditLink {
  margin-left: 6px;
  font-size: .8em;
}

.treeItemContainer {
  position: relative;
}

.treeItem {
  padding: .2em 0;
}

.subItem {
  margin-left: 8px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    width: 0;
    height: 100%;
    border-left: 1px solid $gray30;
  }

  > div:before {
    content: "";
    position: absolute;
    top: 14px;
    width: 1px;
    height: 0;
    padding-left: 12px;
    border-top: 1px solid $gray30;
  }

  > div > div {
    margin-left: 16px;
  }
}

.lastItem {
  &.parentItem {
    margin-top: 10px;
    a {
      font-size: 1em;
    }
  }

  padding-top: 0;

  &.editItem {
    padding-top: .2em;
    &:before {
      height: 18px;
    }
    > div:before {
      top: 17px;
    }
  }

  &:before {
    height: 12px;
  }

  > div:before {
    top: 11px;
  }

  a {
    font-size: .8em;
    margin-left: 1px;
    vertical-align: middle;
  }
}

.treeItemEditor {
  margin-bottom: 10px;
  .parentItem & {
    margin-bottom: 0;
  }
}

.editor {
  .subItem & {
    margin-bottom: 6px;
  }
}
</style>
