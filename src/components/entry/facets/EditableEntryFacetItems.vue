<template>
  <div :class="['editableEntryFacetItems', {empty: isEmpty, hideAddLink}]" v-if="selectedFacets.length">
    <div v-if="isReloading" >
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Kategorien
    </div>

    <div v-else>
      <div v-if="!isEdit">
        <entry-facet-items :items="displayedSavedFacetItems">
          <facet-item-selector
            ref="initialFacetItemSelector"
            slot="buttons"
            v-if="!displayedSavedFacetItems.length"
            :facets="facetsWithSelectableItems"
            :selectedFacetItems="selectedFacetItems"
            :hideAddLink="hideAddLink"
            @click="facetItemClick">
            <span class="inlineEditLink">Kategorien hinzufügen</span>
          </facet-item-selector>

          <a v-else href="" slot="buttons" @click.prevent="showEditForm" class="editLink inlineEditLink">
            Ändern
          </a>
        </entry-facet-items>
      </div>

      <div v-if="isEdit" class="editForm">
        <entry-facet-items
          v-if="displayedSelectedFacetItems.length"
          :items="displayedSelectedFacetItems"
          :selectable="true"
          :sortByInsertion="true"
          @click="deselectFacteItem">

          <facet-item-selector
            slot="buttons"
            v-if="canAddFacetItem"
            :facets="facetsWithSelectableItems"
            :selectedFacetItems="selectedFacetItems"
            @click="facetItemClick">
            <i class="material-icons plusLink">add</i>
          </facet-item-selector>
        </entry-facet-items>

        <facet-item-selector
          v-else
          :facets="facetsWithSelectableItems"
          :selectedFacetItems="selectedFacetItems"
          @click="facetItemClick">
          <div class="addLink">
            <i class="material-icons">add</i> Hinzufügen
          </div>
        </facet-item-selector>

        <div class="buttons">
          <a href="" class="inlineEditLink" @click.prevent="hideEditForm">
            Abbrechen
          </a>

          <button type="button" class="btn btn-xs green waves-effect waves-light" @click="save">
            Speichern
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Spinner from '@/components/Spinner'
import entryListFilters from '@/helpers/entry-list-filters'
import EntryFacetItems from '@/components/entry/facets/EntryFacetItems'
import FacetItemSelector from '@/components/facet/FacetItemSelector'

export default {
  props: ['entry', 'facets', 'bus', 'hideAddLink'],

  data () {
    return {
      selectedFacetItems: [],
      isEdit: false,
      isReloading: 0,
      isEntryDetailSectionContent: true
    }
  },

  created () {
    this.bus.$on('openFacetItemEditor', this.checkHideFrom)
  },

  destroyed () {
    this.bus.$off('openFacetItemEditor', this.checkHideFrom)
  },

  watch: {
    selectedFacets () {
      this.hideEditForm()
    }
  },

  computed: {
    ...mapState({
      selectedFacetsFromFilter: state => state.entryListFilters.selectedFacets
    }),

    selectedFacets () {
      return this.facets || this.selectedFacetsFromFilter
    },

    isEmpty () {
      if (this.isReloading) {
        return false
      }

      if (this.isEdit) {
        return false
      } else {
        return !this.displayedSavedFacetItems.length
      }
    },

    displayedSelectedFacetItems () {
      return entryListFilters.getDisplayedFacetItemsByInsertion(this.selectedFacetItems, this.selectedFacets)
    },

    displayedSavedFacetItems () {
      return entryListFilters.getDisplayedFacetItemsForFacets(this.entry.facet_items, this.selectedFacets)
    },

    facetsWithSelectableItems () {
      return this.selectedFacets.filter(facet => this.selectableItemsLeftForFacet(facet))
    },

    canAddFacetItem () {
      return this.facetsWithSelectableItems.length > 0
    },

    editLinkTitle () {
      if (this.isEdit) {
        return null
      }
      return this.displayedSavedFacetItems.length ? null : 'Hinzufügen'
    }
  },

  methods: {
    editLinkClick (triggerButton) {
      if (this.displayedSavedFacetItems.length) {
        this.showEditForm()
      } else {
        this.$refs.initialFacetItemSelector.showFacetSelector(triggerButton)
      }
    },

    selectableItemsLeftForFacet (facet) {
      const numSelectedItems = this.displayedSelectedFacetItems.filter(facetItem => facetItem.facet === facet).length
      return this.entry.facetOwnerType === facet.main_facet_of ? numSelectedItems < 2 : numSelectedItems < 2
    },

    showEditForm () {
      this.bus.$emit('openFacetItemEditor', this)

      this.selectedFacetItems = this.entry.facet_items.concat()

      this.isEdit = true
    },

    checkHideFrom (other) {
      if (this.isEdit && this !== other) {
        this.hideEditForm()
      }
    },

    hideEditForm () {
      this.selectedFacetItems = []
      this.isEdit = false
    },

    hasSelectedSubItem (facetItem) {
      return facetItem.sub_items.some(subItem => this.selectedFacetItems.includes(subItem))
    },

    deselectFacteItem (facetItem) {
      this.removeFacetItem(facetItem)

      if (facetItem.parent) {
        if (!this.hasSelectedSubItem(facetItem.parent)) {
          this.removeFacetItem(facetItem.parent)
        }
      }
    },

    facetItemClick (facetItem) {
      if (!this.isEdit) {
        this.isEdit = true
      }

      this.selectOrDeselectFacetItem(facetItem)
    },

    selectOrDeselectFacetItem (facetItem) {
      if (this.selectedFacetItems.includes(facetItem)) {
        this.removeFacetItem(facetItem)

        if (!facetItem.parent) {
          this.selectedFacetItems.push(facetItem)
        }

        return
      }

      this.selectedFacetItems.push(facetItem)

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
      let selectedFacetItems = this.entry.facet_items.filter(fi => !this.selectedFacets.includes(fi.facet))
      selectedFacetItems = selectedFacetItems.concat(this.selectedFacetItems)
      this.entry.$rels.facet_items.Query.attachMany(selectedFacetItems).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Kategorien wurden gespeichert.'
          })
          this.facetsSaved()
        }
      })
    },

    facetsSaved () {
      this.isReloading = 1
      this.hideEditForm()

      // show isReloading spinner min 500 ms for good ux
      setTimeout(() => {
        this.isReloading++
        this.setItemsAfterLoading()
      }, 200)

      Promise.all([
        this.entry.$rels.facet_items.refetch()
      ]).then(() => {
        this.isReloading++
        this.setItemsAfterLoading()
      })
    },

    setItemsAfterLoading () {
      if (this.isReloading > 2) {
        this.isReloading = false
        if (!this.facets) { // no facets === using facet filters, todo
          this.$store.dispatch('entryListFilters/entryFacetItemsSaved')
        }
      }
    }
  },

  components: {
    EntryFacetItems,
    Spinner,
    FacetItemSelector
  }
}
</script>


<style lang="scss" scoped>
.empty {
  &.hideAddLink {
    > * {
      display: none;
    }
  }
}

.editLink {
  position: relative;
  top: -.1em;
}

.editForm {
  border: 1px solid $gray20;
  padding: 1em;
  display: inline-block;

  .buttons {
    margin-top: .5em;
    display: flex;
    align-items: baseline;
  }

  a + button, a + a {
    margin-left: .7em;
  }

  .addLink, .plusLink {
    color: $gray50;

    &:hover, &:hover i {
      color: $gray80;
    }
  }

  .plusLink {
    line-height: .95;
    margin-left: -.1em;
  }

  .addLink {
    // height: 2.2em;
    color: $gray50;
    font-size: .9em;
    display: flex;
    align-items: center;

    &:hover, &:hover i {
      color: $gray80;
    }

    i {
      margin-left: -.2em;
    }
  }
}
</style>
