import facetItems from '@/helpers/facet-items'

const facetItemIsSelected = (state, facetItem) => {
  return state.selectedFacetItems.includes(facetItem)
}

const facetWithoutEntriesIsSelected = (state, facet) => {
  return state.selectedFacetsWithoutEntries.includes(facet)
}

const getFilteredEntries = state => {
  return facetItems.getEntriesForFacetItemsAndWithoutFacets(
    state.selectedFacetItems,
    state.selectedFacetsWithoutEntries,
    state.entries
  )
}

export default {
  namespaced: true,

  state: {
    show: false,
    type: null,
    facets: [],
    entries: [],

    selectedFacetItems: [],
    selectedFacetsWithoutEntries: [],
    facetItemFilters: [],

    filteredEntries: []
  },

  mutations: {
    show (state, show) {
      state.show = show
    },

    initFacets (state, facets) {
      state.facets = facets
    },

    initEntries (state, {type, entries}) {
      state.type = type
      state.entries = entries

      state.selectedFacetItems = []
      state.selectedFacetsWithoutEntries = []
      state.facetItemFilters = []
    },

    toggleFacetItemSelection (state, facetItem) {
      if (facetItemIsSelected(state, facetItem)) {
        state.selectedFacetItems = state.selectedFacetItems.filter(fi => fi !== facetItem)
      } else {
        state.selectedFacetItems.push(facetItem)
      }
    },

    toggleFacetWithoutEntriesSelection (state, facet) {
      if (facetWithoutEntriesIsSelected(state, facet)) {
        state.selectedFacetsWithoutEntries = state.selectedFacetsWithoutEntries.filter(i => i !== facet)
      } else {
        state.selectedFacetsWithoutEntries.push(facet)
      }
    },

    setFacetItemFilters (state, facetItemFilters) {
      state.facetItemFilters = facetItemFilters
    },

    setFilteredEntries (state, filteredEntries) {
      state.filteredEntries = filteredEntries
    }
  },

  actions: {
    show ({commit}, show) {
      commit('show', show)
    },

    initFacets ({commit, dispatch}, facets) {
      commit('initFacets', facets)

      dispatch('initFilteredEntries')
    },

    initEntries ({commit, dispatch}, {type, entries}) {
      commit('initEntries', {type, entries})

      dispatch('initFilteredEntries')
    },

    entryFacetItemsChanged ({state, dispatch}) {
      const filteredEntries = getFilteredEntries(state)

      if (!filteredEntries.length) {
        dispatch('initEntries', {type: state.type, entries: state.entries})
      } else {
        dispatch('initFilteredEntries')
      }
    },

    facetItemClick ({commit, dispatch}, facetItem) {
      commit('toggleFacetItemSelection', facetItem)

      dispatch('initFilteredEntries')
      dispatch('computeFacetItemFilters')

      window.scrollTo(0, 0)
    },

    facetWithoutEntriesClick ({commit, dispatch}, facet) {
      commit('toggleFacetWithoutEntriesSelection', facet)

      dispatch('initFilteredEntries')
      dispatch('computeFacetItemFilters')

      window.scrollTo(0, 0)
    },

    initFilteredEntries ({state, commit}, facet) {
      const filteredEntries = getFilteredEntries(state)

      commit('setFilteredEntries', filteredEntries)
    },

    filteredFacetItemClick ({state, dispatch}, facetItem) {
      if (facetItem._isFacetWithoutEntry) {
        dispatch('facetWithoutEntriesClick', facetItem.facet)
      } else {
        dispatch('facetItemClick', facetItem)
      }
    },

    computeFacetItemFilters ({state, commit}, facet) {
      const facetItemFilters = []
      state.facets.forEach(facet => {
        state.selectedFacetItems.forEach(facetItem => {
          if (facetItem.facet === facet) {
            facetItemFilters.push(facetItem)
          }
        })
        state.selectedFacetsWithoutEntries.forEach(emptyFacet => {
          if (emptyFacet === facet) {
            const facetItem = facetItems.createFacetItemEntriesWithoutFacet(facet)
            facetItemFilters.push(facetItem)
          }
        })
      })

      commit('setFacetItemFilters', facetItemFilters)
    }
  }
}
