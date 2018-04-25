<template>
  <div>
    <div class="showButton" v-if="!showFilterBar && !facetItemFilters.length">
      <div>
        <a href="" @click.prevent="showFacetFilter">
          Kategorienfilter
        </a>
      </div>
    </div>

    <div class="facetFilterTags">
      <span v-for="facetItem in facetItemFilters" :key="facetItem.id">
        <span @click.prevent="facetItemClick(facetItem)" class="facetFilterTag inline clickable">
          <tree-item-tag
            :treeItem="facetItem"
            :count="false"
            :x="true" />
        </span>
      </span>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  props: ['items'],

  computed: {
    ...mapState({
      showFilterBar: state => state.facetFilters.show,
      facetItemFilters: state => state.facetFilters.facetItemFilters
    })
  },

  methods: {
    showFacetFilter () {
      this.$store.dispatch('facetFilters/show', true)
    },

    facetItemClick (facetItem) {
      this.$store.dispatch('facetFilters/filteredFacetItemClick', facetItem)
    }
  }
}
</script>


<style lang="scss" scoped>
.showButton {
  margin-bottom: .1em;

  > div {
    display: inline-block;
  }
  i {
    vertical-align: middle;
  }
}

.facetFilterTags {
  margin: .5em 0;
}

.facetFilterTag {
  font-size: 1.2em;

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
</style>
