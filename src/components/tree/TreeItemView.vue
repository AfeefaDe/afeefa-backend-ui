<template>
  <div class="treeItemContainer">
    <div v-if="treeItem.id" :class="['treeItem', {parentItem: !treeItem.parent, subItem: treeItem.parent, editItem: isEdit}]">
      <div>
        <tree-item-tag
          :treeItem="treeItem"
          :chevron="routeConfig.chevron"
          :selected="treeItem.selectedForMoval"
          :icon="treeItem.icon"
          v-if="!isEdit" />

        <span v-if="!isEdit">
          <a href="" @click.prevent="edit()" class="inlineEditLink">
            Ändern
          </a>

          <a href="" @click.prevent="openNavigationSelector()"
            v-if="treeItem.parent || routeConfig.hasOrderItems"
            class="inlineEditLink" ref="moveTrigger">
            Verschieben
          </a>

          <pop-up-selector :trigger="$refs.moveTrigger" diffX="0" @close="hideNavigationSelector" v-if="navigationSelectorIsOpen">
            <navigation-item-selector-content
              v-if="routeConfig.containerName === 'navigation'"
              :selectedNavigationItems="[treeItem]"
              :customParentItem="treeItem.parent ? convertToParentItem : null"
              :hideSubItems="!treeItem.parent"
              @click="navigationItemSelected" />

            <facet-item-selector-content
              :facets="[treeItem.container]"
              :selectedFacetItems="[treeItem.parent, treeItem]"
              :customParentItem="treeItem.parent ? convertToParentItem : null"
              :hideSubItems="true"
              @click="navigationItemSelected" />
          </pop-up-selector>
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
import PopUpSelector from '@/components/PopUpSelector'
import NavigationItemSelectorContent from '@/components/facet/NavigationItemSelectorContent'
import FacetItemSelectorContent from '@/components/facet/FacetItemSelectorContent'

export default {
  props: ['treeItem', 'routeConfig', 'bus'],

  data () {
    return {
      isEdit: false,
      navigationSelectorIsOpen: false,
      orderAndParentChanged: false,
      convertToParentItem: null,
      selectedForMoval: false
    }
  },

  created () {
    this.convertToParentItem = this.routeConfig.createNewTreeItem(this.treeItem.container)

    this.bus.$on('edit', this.checkCancel)
    this.bus.$on('select', this.checkSelect)
  },

  destroyed () {
    this.bus.$off('edit', this.checkCancel)
    this.bus.$off('select', this.checkSelect)
  },

  methods: {
    navigationItemSelected (navigationItem) {
      this.hideNavigationSelector()

      const itemClone = this.routeConfig.cloneTreeItem(this.treeItem)
      itemClone.oldParent = this.treeItem.parent
      this.orderAndParentChanged = true

      // i can be a sub item and replace another sub items position or add myself at last of the parent
      if (!this.treeItem.sub_items.length) {
        // make me a parent item
        if (navigationItem === this.convertToParentItem) {
          itemClone.parent = null
          itemClone.order = this.getContainerTreeItems()[0].order

        // move me to another parent
        } else {
          if (navigationItem.parent) { // replace subitem of parent
            itemClone.parent = navigationItem.parent
            itemClone.order = navigationItem.order
          } else {
            itemClone.parent = navigationItem
            if (navigationItem.sub_items.length) { // set as last of parent
              const [lastItem] = navigationItem.sub_items.slice(-1)
              itemClone.order = lastItem.order + 1
            }
          }
        }
      // i am a parent item and can only replace other parent's order
      } else {
        itemClone.order = navigationItem.order
      }

      this.update(itemClone)
    },

    openNavigationSelector (customTrigger) {
      this.navigationSelectorIsOpen = true

      this.bus.$emit('select', this.treeItem)
    },

    hideNavigationSelector () {
      this.navigationSelectorIsOpen = false
    },

    checkCancel (treeItem) {
      if (treeItem !== this.treeItem) {
        this.cancel()
      }
    },

    checkSelect (treeItem) {
      this.treeItem.selectedForMoval = treeItem === this.treeItem
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
          // tmp remove/add item to parent in order to fill the
          // delay/gap until the container items are reloaded again
          if (!treeItemToSave.id) {
            const list = treeItemToSave.parent
              ? treeItemToSave.parent.sub_items
              : this.getContainerTreeItems()
            list.push(savedTreeItem)
          } else {
            if (this.orderAndParentChanged) {
              const oldList = treeItemToSave.oldParent // parent of original item
                ? treeItemToSave.oldParent.sub_items
                : this.getContainerTreeItems()
              var index = oldList.indexOf(this.treeItem) // remove original item
              if (index !== -1) {
                oldList.splice(index, 1)
              }

              const newList = savedTreeItem.parent
                ? savedTreeItem.parent.sub_items
                : this.getContainerTreeItems()
              newList.push(savedTreeItem)
              savedTreeItem.order -= 0.1 // fake order to sort item at the right place until reloaded
              this.routeConfig.sortTreeItems(newList)

              this.orderAndParentChanged = false
            }
          }

          this.$store.dispatch('messages/showAlert', {
            description: 'Die Kategorie wurde geändert.'
          })

          this.cancel()
          this.$emit('update')
        }
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: `Kategorie ${this.treeItem.title} löschen`,
        message: 'Soll die Kategorie gelöscht werden?\n\nAlle Akteure verlieren diese Kategorie.'
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
                description: 'Die Kategorie wurde gelöscht'
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
    TreeItemEditor,
    PopUpSelector,
    NavigationItemSelectorContent,
    FacetItemSelectorContent
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
