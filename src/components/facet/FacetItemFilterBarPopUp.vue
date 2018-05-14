<template>
  <div>
    <a ref="trigger" href="" @click.prevent="showFilterBar">
      <slot />
    </a>

    <pop-up-selector :trigger="$refs.trigger" :closeIcon="false" @close="hideFilterBar" v-if="filterBarVisible">
      <facet-item-filter-bar />
    </pop-up-selector>
  </div>
</template>

<script>
import PopUpSelector from '@/components/PopUpSelector'
import FacetItemFilterBar from '@/components/facet/FacetItemFilterBar'

export default {
  data () {
    return {
      filterBarVisible: false
    }
  },

  methods: {
    showFilterBar () {
      this.filterBarVisible = true
    },

    hideFilterBar () {
      this.filterBarVisible = false
    }
  },

  components: {
    PopUpSelector,
    FacetItemFilterBar
  }
}
</script>
