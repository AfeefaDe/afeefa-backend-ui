<template>
  <div>
    <a ref="trigger" href="" @click.prevent="showFacetSelector">
      <slot />
    </a>

    <pop-up-selector ref="popUp" :trigger="$refs.trigger"
      :diffX="40" :diffY="20" align="right" :closeIcon="true"
      @close="hideFacetSelector"
      v-if="facetSelectorVisible">
      <div class="facetSelector">
        <div class="facet" v-for="facet in selectableFacets" :key="'select-' + facet.id">
          <div class="facetCheckbox">
            <facet-item-tag
              @click="selectOrDeselectFacet(facet)"
              :item="facet"
              :color="facet.color"
              :more="false"
              :checked="selectedFacets.includes(facet)"
              :checkbox="true" />
          </div>
        </div>

        <div class="facetCheckbox">
          <facet-item-tag
            @click="selectOrDeselectNavigation"
            :item="{}"
            title="Navigation"
            color="#999999"
            :more="false"
            :checked="navigationIsSelected"
            :checkbox="true" />
        </div>
      </div>
    </pop-up-selector>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PopUpSelector from '@/components/PopUpSelector'

export default {
  data () {
    return {
      facetSelectorVisible: false
    }
  },

  computed: {
    ...mapGetters('entryListFilters', ['selectableFacets']),

    ...mapState({
      selectedFacets: state => state.entryListFilters.selectedFacets,
      navigationIsSelected: state => state.entryListFilters.navigationIsSelected
    })
  },

  methods: {
    selectOrDeselectNavigation () {
      this.$store.dispatch('entryListFilters/selectOrDeselectNavigation')
    },

    showFacetSelector () {
      this.facetSelectorVisible = true
    },

    hideFacetSelector () {
      this.facetSelectorVisible = false
    },

    selectOrDeselectFacet (facet) {
      this.$store.dispatch('entryListFilters/selectOrDeselectFacet', facet)
    }
  },

  components: {
    PopUpSelector
  }
}
</script>

<style lang="scss" scoped>
.facetSelector {
  padding: .5em;
}

.facet .facetCheckbox {
  margin-bottom: .1em;
}

.facetItemTag {
  margin-bottom: .2em;
  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: $white;
  }

  /deep/ .facetItem {
    padding: 0 .1em;

    .checkbox {
      margin-left: .3em;
      margin-right: .2em;
    }
  }
}
</style>
