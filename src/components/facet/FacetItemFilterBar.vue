<template>
  <div class="filterBar">
    <div class="closeIcon" @click="close" v-if="false && !facetItemFilters.length">
      <i class="material-icons">cancel</i>
    </div>

    <div class="facetSelector" v-if="false">
      <facet-selector-item v-for="facet in selectableFacets" :key="'select-' + facet.id"
        @click="selectOrDeselectFacet(facet)"
        :item="facet"
        :color="facet.color"
        :checked="selectedFacets.includes(facet)"
        :checkbox="true" />
    </div>

    <div class="facetItemFilters" v-if="selectedFacets.length">
      <div v-for="facet in selectedFacets" :key="facet.id" class="facetTags">
        <div v-for="facetItem in facet.facet_items" :key="facetItem.id" class="facetItemContainer">
          <div v-if="facetItemHasEntries(facetItem)">
            <div
              :class="['facetItem', {selected: facetItemIsSelected(facetItem)}]"
              :style="{'border-left-color': facet.color}"
              @click="facetItemClick(facetItem)">
              {{ facetItem.title }}
              <span class="hint">{{ countEntriesForFacetItem(facetItem) }}</span>
              <i class="material-icons" v-if="facetItemIsSelected(facetItem)">cancel</i>
            </div>
          </div>

          <div v-else>
            <div
              class="facetItem disabled"
              :style="{'border-left-color': facet.color}">
              {{ facetItem.title }}
              <span class="hint">{{ countEntriesForFacetItem(facetItem) }}</span>
            </div>
          </div>
        </div>

        <div class="facetItemContainer">
          <div v-if="countEntriesWithoutFacet(facet)">
            <div
              :class="['facetItem', {selected: entriesWithoutFacetIsSelected(facet)}]"
              :style="{'border-left-color': facet.color}"
              @click="entriesWithoutFacetClick(facet)">
              Nicht zugeordnet
              <span class="hint">{{ countEntriesWithoutFacet(facet) }}</span>
              <i class="material-icons" v-if="entriesWithoutFacetIsSelected(facet)">cancel</i>
            </div>
          </div>

          <div v-else>
            <div
              class="facetItem disabled"
              :style="{'border-left-color': facet.color}">
              Nicht zugeordnet
              <span class="hint">0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import facetItems from '@/helpers/facet-items'
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('facetFilters', ['selectableFacets']),

    ...mapState({
      selectedFacets: state => state.facetFilters.selectedFacets,
      selectedFacetItems: state => state.facetFilters.selectedFacetItems,
      selectedFacetsWithoutEntries: state => state.facetFilters.selectedFacetsWithoutEntries,
      filteredEntries: state => state.facetFilters.filteredEntries,
      facetItemFilters: state => state.facetFilters.facetItemFilters
    })
  },

  methods: {
    close () {
      this.$store.dispatch('facetFilters/show', false)
    },

    selectOrDeselectFacet (facet) {
      this.$store.dispatch('facetFilters/selectOrDeselectFacet', facet)
    },

    countEntriesForFacet (facet) {
      return facetItems.getEntriesForFacet(facet, this.filteredEntries).length
    },

    countEntriesForFacetItem (facetItem) {
      return facetItems.getEntriesForFacetItem(facetItem, this.filteredEntries).length
    },

    facetItemIsSelected (facetItem) {
      return this.selectedFacetItems.includes(facetItem)
    },

    facetItemClick (facetItem) {
      this.$store.dispatch('facetFilters/show', true)
      this.$store.dispatch('facetFilters/facetItemClick', facetItem)
    },

    facetItemHasEntries (facetItem) {
      return this.filteredEntries.some(entry => {
        return entry.facet_items.includes(facetItem)
      })
    },

    entriesWithoutFacetIsSelected (facet) {
      return this.selectedFacetsWithoutEntries.includes(facet)
    },

    createEmptyFacetItem (facet) {
      return facetItems.createFacetItemEntriesWithoutFacet(facet)
    },

    entriesWithoutFacetClick (facet) {
      this.$store.dispatch('facetFilters/show', true)
      this.$store.dispatch('facetFilters/facetWithoutEntriesClick', facet)
    },

    countEntriesWithoutFacet (facet) {
      return facetItems.getEntriesWithoutFacet(facet, this.filteredEntries).length
    }
  }
}
</script>


<style lang="scss" scoped>
.filterBar {
  max-height: calc(100vh - 6.5em);
  position: relative;

  display: flex;
  flex-direction: column;
}

.closeIcon {
  position: absolute;
  cursor: pointer;
  top: -.6em;
  right: -.5em;
  i {
    font-size: 24px;
    color: $gray30;
    &:hover {
      color: $gray20;
    }
  }
}

.facetSelectorItem {
  margin-bottom: .2em;

  /deep/ .facetItem {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.facetItemFilters {
  flex: 8;
  overflow-y: auto;
}

.facetTags {
  &:not(:first-child) {
    margin-top: 2em;
  }
}

.facetItemContainer > * {
  display: flex;
}

.facetItem {
  @include user-select();

  display: inline-flex;
  align-items: center;
  margin: 0;
  margin-right: 6px;
  padding: .1em .3em;
  cursor: pointer;
  font-size: .9em;
  border-left: 3px solid;
  white-space: nowrap;
  color: $gray80;

  &:not(.disabled):hover {
    background-color: $white;
  }

  &.selected, &.selected:hover {
    background-color: $white;
  }

  &.disabled {
    opacity: .4;
    cursor: auto;
  }

  .hint {
    font-size: .8em;
    margin-left: .4em;
  }

  i {
    font-size: 1.1em;
    margin-left: .2em;
    color: $gray80;
  }
}

.colorIcon {
  vertical-align: middle;
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

</style>
