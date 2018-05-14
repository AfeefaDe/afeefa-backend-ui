<template>
  <div :class="['editableEntryFacetItems', {empty: isEmpty}]" v-if="selectedFacets.length">
    <div v-if="loading" >
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Kategorien
    </div>

    <div v-else>
      <div v-if="!isEdit">
        <entry-facet-items :items="displayedSavedFacetItems" :count="false">
          <a href="" @click.prevent="showEditForm" class="editLink inlineEditLink" ref="addLink" slot="buttons">
            {{ displayedSavedFacetItems.length ? 'Ändern' : 'Kategorien hinzufügen' }}
          </a>
        </entry-facet-items>
      </div>

      <div v-if="isEdit" class="editForm">
        <entry-facet-items
          v-if="displayedSelectedFacetItems.length"
          :items="displayedSelectedFacetItems"
          :selectable="true" :count="false"
          :sortByInsertion="true"
          @click="deselectFacteItem">
          <a href="" @click.prevent="showFacetTree"
            v-if="canAddFacetItem"
            slot="buttons" class="plusLink" ref="addLink">
            <i class="material-icons">add</i>
            <span v-if="!displayedSelectedFacetItems.length">Hinzufügen</span>
          </a>
        </entry-facet-items>

        <a v-else href="" @click.prevent="showFacetTree"
          class="addLink" ref="addLink">
          <i class="material-icons">add</i>
          <span v-if="!displayedSelectedFacetItems.length">Hinzufügen</span>
        </a>

        <div class="buttons">
          <a href="" class="inlineEditLink" @click.prevent="hideEditForm">
            Abbrechen
          </a>

          <button class="btn btn-xs green waves-effect waves-light" @click="save">
            Speichern
          </button>
        </div>
      </div>

      <facet-items-tree
        v-if="facetTreeVisible"
        :facets="facetsWithSelectableItems"
        ref="facetTree"
        :selectedFacetItems="selectedFacetItems"
        @close="hideFacetTree"
        @click="facetItemClick" />
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Facet from '@/models/Facet'
import Spinner from '@/components/Spinner'
import facetItems from '@/helpers/facet-items'
import EntryFacetItems from '@/components/entry/EntryFacetItems'
import FacetItemsTree from '@/components/facet/FacetItemsTree'
import FacetTreeMixin from '@/components/facet/mixins/FacetTreeMixin'

export default {
  mixins: [FacetTreeMixin],

  props: ['entry', 'facets', 'bus'],

  data () {
    return {
      selectedFacetItems: [],
      isEdit: false,
      facetTreeVisible: false,
      loading: false
    }
  },

  created () {
    this.initSelectedFacetItems()

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
      selectedFacetsFromFilter: state => state.facetFilters.selectedFacets
    }),

    selectedFacets () {
      return this.facets || this.selectedFacetsFromFilter
    },

    isEmpty () {
      if (this.loading) {
        return false
      }

      if (this.isEdit) {
        return false
      } else {
        return !this.displayedSavedFacetItems.length
      }
    },

    displayedSelectedFacetItems () {
      return facetItems.getDisplayedFacetItemsByInsertion(this.selectedFacetItems, this.selectedFacets)
    },

    displayedSavedFacetItems () {
      return facetItems.getDisplayedFacetItemsForFacets(this.entry.facet_items, this.selectedFacets)
    },

    facetsWithSelectableItems () {
      return this.selectedFacets.filter(facet => this.selectableItemsLeftForFacet(facet))
    },

    canAddFacetItem () {
      return this.facetsWithSelectableItems.length > 0
    }
  },

  methods: {
    selectableItemsLeftForFacet (facet) {
      const numSelectedItems = this.displayedSelectedFacetItems.filter(facetItem => facetItem.facet === facet).length
      return this.entry.facetOwnerType === facet.main_facet_of ? numSelectedItems < 2 : numSelectedItems < 2
    },

    showEditForm () {
      this.bus.$emit('openFacetItemEditor', this)

      this.selectedFacetItems = this.entry.facet_items.concat()

      if (!this.displayedSelectedFacetItems.length) {
        this.showFacetTree()
        return
      }

      this.isEdit = true
    },

    checkHideFrom (other) {
      console.log('check on off')
      if (this.isEdit && this !== other) {
        this.isEdit = false
      }
    },

    hideEditForm () {
      this.isEdit = false
    },

    showFacetTree () {
      window.addEventListener('click', this.onClickOutside)

      this.facetTreeVisible = true


      this.$nextTick(() => {
        let link = this.$refs.addLink
        let tree = this.$refs.facetTree
        this.positionTree(tree.$el, link.offsetLeft, link.offsetTop, 0, -10)
      })
    },

    onClickOutside (e) {
      const facetTree = this.$refs.facetTree
      if (facetTree && !facetTree.$el.contains(e.target)) {
        this.hideFacetTree()
      }
    },

    hideFacetTree () {
      window.removeEventListener('click', this.onClickOutside)

      this.facetTreeVisible = false
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

      this.hideFacetTree()
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
      this.loading = true
      this.isEdit = false
      Promise.all([
        this.entry.$rels.facet_items.refetch()
      ]).then(() => {
        if (!this.facets) { // using facet filters, todo
          this.$store.dispatch('facetFilters/entryFacetItemsSaved')
        }
        this.loading = false
      })

      Facet.Query.getAll()
    }
  },

  components: {
    EntryFacetItems,
    Spinner,
    FacetItemsTree
  }
}
</script>


<style lang="scss" scoped>
.editLink {
  position: relative;
  top: -.1em;
}

.editForm {
  border: 1px solid $gray20;
  padding: 1em;
  display: inline-block;

  .buttons {
    margin-top: .8em;
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
    i {
      margin-left: -.1em;
    }
  }

  .addLink {
    height: 2.2em;
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
