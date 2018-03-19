<template>
  <div class="facetItemContainer">
    <div v-if="facetItem.id" :class="['facetItem', {parentItem: !isSub, subItem: isSub, editItem: isEdit}]">
      <div>
        <facet-item-tag :facetItem="facetItem" v-if="!isEdit" />

        <span v-if="!isEdit">
          <a href="" @click.prevent="edit()" class="inlineEditLink">
            Ändern
          </a>
          <router-link :to="{name: 'facetitem.associate', params: {facetItemId: facetItem.id}}" class="inlineEditLink">
            Zuordnen
          </router-link>
        </span>

        <facet-item-editor
          v-if="isEdit"
          class="editor"
          :item="facetItem"
          :hasColor="!isSub"
          @cancel="cancel"
          @update="update"
          @remove="remove" />
      </div>
    </div>

    <div v-else :class="['facetItem', 'lastItem', {parentItem: !isSub, subItem: isSub, editItem: isEdit}]">
      <div>
        <div>
          <a href="" @click.prevent="edit()" v-if="!isEdit" class="inlineEditLink">
            Hinzufügen
          </a>
          <facet-item-editor
            v-if="isEdit"
            class="editor"
            :item="facetItem"
            :hasColor="!isSub"
            @cancel="cancel"
            @update="update"
            @remove="remove" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import FacetItemTag from '@/components/facet/FacetItemTag'
import FacetItemEditor from '@/components/facet/FacetItemEditor'

export default {
  props: ['facetItem', 'bus', 'isSub'],

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
    checkCancel (facetItem) {
      if (facetItem !== this.facetItem) {
        this.cancel()
      }
    },

    edit () {
      this.isEdit = true
      this.bus.$emit('edit', this.facetItem)

      this.$nextTick(() => {
        const elBottom = this.$el.offsetTop + this.$el.offsetHeight
        const scrollBottom = window.scrollY + window.innerHeight
        if (elBottom > scrollBottom) {
          window.scrollTo(0, window.scrollY + (elBottom - scrollBottom) + 10)
        }
      })
    },

    cancel () {
      this.facetItem.previewColor = null
      this.isEdit = false
    },

    update (facetItemToSave) {
      this.facetItem.facet.$rels.facet_items.Query.save(facetItemToSave).then(savedFacetItem => {
        // tmp add item to parent in order to fill the
        // delay/gap until the facet ist reloaded again
        if (!facetItemToSave.id) {
          if (facetItemToSave.parent) {
            facetItemToSave.parent.sub_items.push(savedFacetItem)
          } else {
            this.facetItem.facet.facet_items.push(savedFacetItem)
          }
        }
        if (savedFacetItem) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Das Attribut wurde geändert.'
          })
        }
        this.$emit('update')
        this.cancel()
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: `Attribut ${this.facetItem.title} löschen`,
        message: 'Soll das Attribut gelöscht werden?\n\nAlle Akteure verlieren dieses Attribut.'
      }).then(result => {
        if (result === 'yes') {
          this.facetItem.facet.$rels.facet_items.Query.delete(this.facetItem).then(deleted => {
            if (deleted) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Das Attribut wurde gelöscht'
              })
              this.$emit('remove')
            }
          })
        }
      })
    }
  },

  components: {
    FacetItemTag,
    FacetItemEditor
  }
}
</script>


<style lang="scss" scoped>
.inlineEditLink {
  margin-left: 6px;
  font-size: .8em;
}

.facetItemTag {
  font-size: 1.1em;
}

.facetItemContainer {
  position: relative;
}

.facetItem {
  padding: .5em 0;
}

.subItem {
  padding: .2em 0;
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

.facetItemEditor {
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
