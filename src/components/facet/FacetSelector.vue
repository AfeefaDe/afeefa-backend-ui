<template>
  <div>
    <modal ref="modal">
      <div class="modalContent">
        <div class="ownerInfo">
          {{ owner.title }}
        </div>

        <div class="facetSelector">
          <div class="navigation">
            <div v-for="facet in facets" :key="facet.id" v-if="facetSupportsOwner(facet)">
              <div :style="{'background-color': facet.color}" class="colorIcon"></div>
              <a v-if="!isExpanded(facet)" href="" @click.prevent="toggleExpand(facet)">{{ facet.title }} ({{ countSelectedFacetItems(facet) }})</a>
              <span v-else>{{ facet.title }} ({{ countSelectedFacetItems(facet) }})</span>
            </div>
          </div>

          <div class="facetItems" v-if="expandedFacet">
            <div class="selectorContent">
              <div v-for="facetItem in expandedFacet.facet_items" :key="facetItem.id">
                <div @click.prevent="addFacetItem(facetItem)" class="facetTag parentItem">
                  <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + facetItem.id" :checked="selectedFacetItems.includes(facetItem)">
                  <label :for="'select' + facetItem.id"></label>
                  <tree-item-tag :treeItem="facetItem" :class="{isSelected: selectedFacetItems.includes(facetItem)}"/>
                </div>

                <div v-for="(subItem, index) in facetItem.sub_items" :key="subItem.id">
                  <tree-sub-item :isLast="index === facetItem.sub_items.length - 1">
                    <div @click.prevent="addFacetItem(subItem)" class="facetTag">
                      <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + subItem.id" :checked="selectedFacetItems.includes(subItem)">
                      <label :for="'select' + subItem.id"></label>
                      <tree-item-tag :treeItem="subItem" :class="{isSelected: selectedFacetItems.includes(subItem)}"/>
                    </div>
                  </tree-sub-item>
                </div>
              </div>
            </div>
          </div>

          <div class="selectedFacetItems">
            <div class="selectorContent">
              <div v-for="facet in facets" :key="facet.id" v-if="facetSupportsOwner(facet) && hasFacetItemForFacet(facet)" class="selectedFacet">
                <div>{{ facet.title }}</div>

                <div class="selectedFacetItemsContainer">
                  <div v-for="facetItem in facet.facet_items" :key="facetItem.id" v-if="selectedFacetItems.includes(facetItem)">
                    <div @click="removeFacetItem(facetItem)" class="facetTag parentItem">
                      <tree-item-tag :treeItem="facetItem" />
                    </div>
                    <div v-for="subItem in facetItem.sub_items" :key="subItem.id" v-if="selectedFacetItems.includes(subItem)">
                      <tree-sub-item :isLast="isLastSelectedItemOfParent(facetItem, subItem)">
                        <div @click="removeFacetItem(subItem)" class="facetTag">
                          <tree-item-tag :treeItem="subItem" />
                        </div>
                      </tree-sub-item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="footer">
          <button class="btn btn-medium gray waves-effect waves-light" @click="hideModal">
            Abbrechen
          </button>
          <button class="btn btn-medium green waves-effect waves-light" @click="save">
            Speichern
          </button>
        </div>
      </div>
    </modal>

    <a href="" class="inlineEditLink" @click.prevent="showModal">
      Kategorien ändern
    </a>
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import Modal from '@/components/Modal'
import TreeItemTag from '@/components/tree/TreeItemTag'
import TreeSubItem from '@/components/tree/TreeSubItem'

export default {
  props: ['owner'],

  data () {
    return {
      facets: [],
      selectedFacetItems: [],
      expandedFacet: null
    }
  },

  created () {
    Facet.Query.getAll().then(facets => {
      this.facets = facets
      this.initSelectedItems()
    })
  },

  methods: {
    facetSupportsOwner (facet) {
      let ownerType = ''
      switch (this.owner.type) {
        case 'orgas':
          ownerType = 'Orga'
          break
        case 'events':
          ownerType = 'Event'
          break
        case 'offers':
          ownerType = 'Offer'
          break
      }
      return !ownerType || facet.owner_types.includes(ownerType)
    },

    initSelectedItems () {
      this.selectedFacetItems = []
      this.expandedFacet = null

      this.facets.forEach(facet => {
        if (!this.expandedFacet && this.facetSupportsOwner(facet)) {
          this.expandedFacet = facet
        }

        facet.facet_items.forEach(facetItem => {
          if (this.owner.facet_items.includes(facetItem)) {
            this.selectedFacetItems.push(facetItem)
          }
          facetItem.sub_items.forEach(subItem => {
            if (this.owner.facet_items.includes(subItem)) {
              this.selectedFacetItems.push(subItem)
            }
          })
        })
      })
    },

    countSelectedFacetItems (facet) {
      return this.selectedFacetItems.filter(item => item.facet === facet).length
    },

    expand (facet) {
      this.expandedFacet = facet
    },

    collapse (facet) {
      this.expandedFacet = null
    },

    toggleExpand (facet) {
      if (this.isExpanded(facet)) {
        this.collapse(facet)
      } else {
        this.expand(facet)
      }
    },

    isExpanded (facet) {
      return this.expandedFacet === facet
    },

    hasFacetItemForFacet (facet) {
      return this.selectedFacetItems.find(item => item.facet.id === facet.id)
    },

    showModal () {
      this.initSelectedItems()
      this.$refs.modal.show()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    isLastSelectedItemOfParent (parent, selectedItem) {
      let found = false
      for (let i = 0; i < parent.sub_items.length; i++) {
        const item = parent.sub_items[i]
        if (found && this.selectedFacetItems.includes(item)) {
          return false
        }
        if (item === selectedItem) {
          found = true
        }
      }
      return true
    },

    addFacetItem (facetItem) {
      if (this.selectedFacetItems.includes(facetItem)) {
        this.removeFacetItem(facetItem)
        return
      }

      if (!this.selectedFacetItems.includes(facetItem)) {
        this.selectedFacetItems.push(facetItem)
      }

      if (facetItem.parent) {
        if (!this.selectedFacetItems.includes(facetItem.parent)) {
          this.selectedFacetItems.push(facetItem.parent)
        }
      }
    },

    removeFacetItem (facetItem) {
      if (this.selectedFacetItems.includes(facetItem)) {
        this.selectedFacetItems = this.selectedFacetItems.filter(item => {
          if (item.parent && item.parent.id === facetItem.id) {
            return false
          }
          if (item.id === facetItem.id) {
            return false
          }
          return true
        })
      }
    },

    save () {
      this.hideModal()

      this.owner.$rels.facet_items.Query.attachMany(this.selectedFacetItems).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Kategorien wurden gespeichert.'
          })
          this.$emit('saved')
        }
      })
    }
  },

  components: {
    Modal,
    TreeItemTag,
    TreeSubItem
  }
}
</script>

<style lang="scss" scoped>
.modalContent {
  width: 800px;
}

.ownerInfo {
  margin-bottom: 20px;
}

.navigation {
  border-right: 1px solid $gray20;
  margin-right: 20px;
  height: 500px;
}

.colorIcon {
  vertical-align: baseline;
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 3px;
}

.facetSelector {
  width: 100%;
  display: flex;
  justify-content: space-between;

  > * {
    width: 35%;
  }

  > *:first-child {
    width: 30%;
  }
}

.selectorContent {
  width: 100%;
  height: 500px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.facetItems {
  padding-right: 10px;
}

.facetTag {
  display: inline-block;
  cursor: pointer;
}

.parentItem {
  margin-bottom: 2px;
}

.selectedFacetItemsContainer {
  margin-top: 5px;
}

.selectedFacetItems {
  // width: 33%;
  padding-left: 10px;
}

.selectedFacet {
  margin-bottom: 10px;
}

.footer {
  margin-top: 2em;
  text-align: right;
  button {
    margin-left: .4em;
  }
}

/* stylelint-disable selector-class-pattern */
input[type="checkbox"].filled-in.checkboxSmall:not(:checked) + label {
  &:after {
    border-color: $gray30;
  }
}
</style>
