<template>
  <div>
    <modal ref="modal" class="modalWindow">
      <div class="modalContent">
        <div class="ownerInfo">
          {{ owner.title }} <i class="material-icons">chevron_right</i> Navigation ändern
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
                <div class="facetTag parentItem">
                  <tree-item-tag
                    :treeItem="facetItem"
                    :x="selectedFacetItems.includes(facetItem)"
                    @click="addFacetItem" />
                </div>

                <div v-for="(subItem, index) in facetItem.sub_items" :key="subItem.id" :class="{lastSubItemContainer: index === facetItem.sub_items.length - 1}">
                  <tree-sub-item :isLast="index === facetItem.sub_items.length - 1">
                    <div class="facetTag">
                      <tree-item-tag
                        :treeItem="subItem"
                        :x="selectedFacetItems.includes(subItem)"
                        @click="addFacetItem" />
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
                    <div class="facetTag parentItem">
                      <tree-item-tag
                        :treeItem="facetItem"
                        :x="true"
                        @click="removeFacetItem(facetItem)" />
                    </div>
                    <div v-for="subItem in facetItem.sub_items" :key="subItem.id" v-if="selectedFacetItems.includes(subItem)" :class="{lastSubItemContainer: isLastSelectedItemOfParent(facetItem, subItem)}">
                      <tree-sub-item :isLast="isLastSelectedItemOfParent(facetItem, subItem)">
                        <div class="facetTag">
                          <tree-item-tag
                            :treeItem="subItem"
                            :x="true"
                            @click="removeFacetItem(subItem)" />
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
      Navigation {{ owner.facet_items.length ? 'ändern' : 'hinzufügen' }}
    </a>
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import Modal from '@/components/Modal'
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
    TreeSubItem
  }
}
</script>

<style lang="scss" scoped>
.modalWindow /deep/ .modal__window {
  width: 80%;
  max-width: 1000px;
}

.ownerInfo {
  margin-bottom: 20px;

  i {
    vertical-align: middle;
    font-size: 1.2em;
  }
}

.navigation {
  border-right: 1px solid $gray20;
  margin-right: 20px;
  height: 500px;

  > * {
    margin-bottom: .3em;
  }
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
  margin-bottom: 1px;
}

.parentItem {
  margin-bottom: 4px;
}

.lastSubItemContainer {
  margin-bottom: .5em;
}

.selectedFacetItemsContainer {
  margin-top: .8em;
}

.selectedFacetItems {
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
</style>
