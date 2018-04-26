<template>
  <div class="filterBar">
    <div class="closeIcon" @click="close" v-if="!facetItemFilters.length">
      <i class="material-icons">cancel</i>
    </div>

    <div v-for="facet in facets" :key="facet.id" class="facet" v-if="entryHasFacet(facet)">
      <div :style="{'background-color': facet.color}" class="colorIcon"></div>
      <a href="" class="facetTitle" @click.prevent="selectedFacet = (selectedFacet === facet ? null : facet)">{{ facet.title }} ({{ countEntriesForFacet(facet) }})</a>

      <div class="facetTags" v-if="facet === selectedFacet">
        <div v-for="facetItem in facet.facet_items" :key="facetItem.id">
          <div v-if="facetItemHasEntries(facetItem)">
            <div @click.prevent="facetItemClick(facetItem)" class="facetTag clickable">
              <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + facetItem.id" :checked="facetItemIsSelected(facetItem)">
              <label :for="'select' + facetItem.id"></label>
              <tree-item-tag
                :treeItem="facetItem"
                :countOwners="countEntriesForFacetItem(facetItem)"
                :x="facetItemIsSelected(facetItem)" />
            </div>
          </div>

          <div v-else class="facetTagDisabled facetTag">
            <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + facetItem.id" :checked="false">
            <label :for="'select' + facetItem.id"></label>
            <tree-item-tag :treeItem="facetItem" :countOwners="0" />
          </div>
        </div>

        <div @click.prevent="entriesWithoutFacetClick(facet)" v-if="countEntriesWithoutFacet(facet)" class="facetTag clickable">
          <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + facet.id" :checked="entriesWithoutFacetIsSelected(facet)">
          <label :for="'select' + facet.id"></label>
          <tree-item-tag
            :treeItem="createEmptyFacetItem(facet)"
            :countOwners="countEntriesWithoutFacet(facet)"
            :x="entriesWithoutFacetIsSelected(facet)" />
        </div>

        <div v-else class="facetTagDisabled facetTag">
          <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + facet.id" :checked="false">
          <label :for="'select' + facet.id"></label>
          <tree-item-tag :treeItem="createEmptyFacetItem(facet)" :countOwners="0" />
        </div>
      </div>

      <div class="facetTags" v-else>
        <div v-for="facetItem in selectedFacetItems" :key="facetItem.id" v-if="facetItem.facet === facet">
          <div @click.prevent="facetItemClick(facetItem)" class="facetTag clickable">
            <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + facetItem.id" :checked="facetItemIsSelected(facetItem)">
            <label :for="'select' + facetItem.id"></label>
            <tree-item-tag
              :treeItem="facetItem"
              :countOwners="countEntriesForFacetItem(facetItem)"
              :x="true" />
          </div>
        </div>
        <div @click.prevent="entriesWithoutFacetClick(facet)" class="facetTag clickable" v-if="entriesWithoutFacetIsSelected(facet)">
          <input type="checkbox" class="filled-in checkboxSmall" :id="'select' + facet.id" :checked="entriesWithoutFacetIsSelected(facet)">
          <label :for="'select' + facet.id"></label>
          <tree-item-tag
            :treeItem="createEmptyFacetItem(facet)"
            :countOwners="countEntriesWithoutFacet(facet)"
            :x="true" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import TreeItemTag from '@/components/tree/TreeItemTag'
import facetItems from '@/helpers/facet-items'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selectedFacet: null
    }
  },

  created () {
    this.selectedFacet = this.facets.find(facet => {
      return this.entryHasFacet(facet)
    })
  },

  computed: {
    ...mapState({
      facets: state => state.facetFilters.facets,
      selectedFacetItems: state => state.facetFilters.selectedFacetItems,
      selectedFacetsWithoutEntries: state => state.facetFilters.selectedFacetsWithoutEntries,
      entryType: state => state.facetFilters.type,
      filteredEntries: state => state.facetFilters.filteredEntries,
      facetItemFilters: state => state.facetFilters.facetItemFilters
    })
  },

  methods: {
    close () {
      this.$store.dispatch('facetFilters/show', false)
    },

    entryHasFacet (facet) {
      return facet.owner_types.includes(this.entryType)
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
  },

  components: {
    TreeItemTag
  }
}
</script>


<style lang="scss" scoped>
.filterBar {
  position: relative;
  min-width: 250px;
  line-height: 1.7em;
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

.colorIcon {
  vertical-align: middle;
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.facetTitle {
  font-size: .9em;
  a {
    color: inherit;
  }
}

.facet:first-child .facetTitle {
  margin-top: 0;
}

.facetTags {
  margin-top: .2em;

  > *:first-child {
    margin-top: .5em;
  }

  > *:last-child {
    margin-bottom: 1em;
  }
}

input, label {
  display: none !important;
}

.facetTag {
  display: inline-block;
  > * {
    white-space: nowrap;
  }

  &.clickable {
    cursor: pointer;
  }

  &.inline {
    margin-right: .4em;
    padding-bottom: .4em;
  }
}

.facetTagDisabled {
  opacity: .3;
}

/* stylelint-disable selector-class-pattern */
input[type="checkbox"].filled-in.checkboxSmall:not(:checked) + label {
  &:after {
    border-color: $gray30;
  }
}
</style>
