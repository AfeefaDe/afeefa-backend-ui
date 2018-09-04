<template>
  <div>
    <a ref="trigger" href="" @click.prevent="showFacetSelector">
      <slot />
    </a>

    <pop-up-selector ref="popUp" :trigger="$refs.trigger" :diffX="10" :diffY="10" align="left" :closeIcon="false" @close="hideFacetSelector" v-if="facetSelectorVisible">
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
    ...mapGetters('facetFilters', ['selectableFacets']),

    ...mapState({
      selectedFacets: state => state.facetFilters.selectedFacets,
      navigationIsSelected: state => state.facetFilters.navigationIsSelected
    })
  },

  methods: {
    selectOrDeselectNavigation () {
      this.$store.dispatch('facetFilters/selectOrDeselectNavigation')
    },

    showFacetSelector () {
      this.facetSelectorVisible = true
    },

    hideFacetSelector () {
      this.facetSelectorVisible = false
    },

    selectOrDeselectFacet (facet) {
      this.$store.dispatch('facetFilters/selectOrDeselectFacet', facet)
      this.$nextTick(() => {
        this.$refs.popUp.reposition()
      })
    }
  },

  components: {
    PopUpSelector
  }
}
</script>

<style lang="scss" scoped>
.facetSelector {
  padding: 1em;
}

.facetCheckbox {
  margin-bottom: .3em;
}

.facetItemTag {
  margin-bottom: .2em;
  &:last-child {
    margin-bottom: 0;
  }

  /deep/ .facetItem {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
