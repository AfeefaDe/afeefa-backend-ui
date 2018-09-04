<template>
  <div class="statusSelector">
    <select class="browser-default" v-model="selectedActiveState">
      <option v-for="state in activeStates" :key="state.name" :value="state">
        {{ state.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selectedState: null,
      states: [
        { name: 'Alle', value: 'all' },
        { name: 'Aktive', value: 'active' },
        { name: 'Inaktive', value: 'inactive' }
      ]
    }
  },

  computed: {
    ...mapState({
      activeStates: state => state.facetFilters.activeStates
    }),

    selectedActiveState: {
      get () { return this.$store.state.facetFilters.selectedActiveState },
      set (state) { this.$store.dispatch('facetFilters/setActiveState', state) }
    }
  }
}
</script>

<style lang="scss" scoped>
.statusSelector {
  select {
    width: auto;
  }
}
</style>
