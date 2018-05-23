import facetItems from '@/helpers/facet-items'

function facetIsSelected (state, facet) {
  return state.selectedFacets.includes(facet)
}

function facetItemIsSelected (state, facetItem) {
  return state.selectedFacetItems.includes(facetItem)
}

function facetWithoutEntriesIsSelected (state, facet) {
  return state.selectedFacetsWithoutEntries.includes(facet)
}

function getFilteredEntries (state) {
  const entries = getFilteredEntriesWithoutNavigation(state)

  if (state.selectedNavigationItem) {
    if (state.selectedNavigationItem._isNavigationWithoutEntry) {
      return facetItems.getEntriesWithoutNavigationItem(entries)
    } else {
      return facetItems.getEntriesForNavigationItem(state.selectedNavigationItem, entries)
    }
  } else {
    return entries
  }
}

function getFilteredEntriesWithoutNavigation (state) {
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
    facetOwnerType: null,
    facets: [],
    entries: [],

    selectedFacets: [],
    selectedFacetItems: [],
    selectedFacetsWithoutEntries: [],
    facetItemFilters: [],

    navigationIsSelected: false,
    selectedNavigationItem: null,

    filteredEntries: [],
    filteredEntriesWithoutNavigation: []
  },

  getters: {
    selectableFacets: state => {
      return facetItems.getFacetsForOwnerType(state.facets, state.facetOwnerType)
    }
  },

  mutations: {
    show (state, show) {
      state.show = show
    },

    initFacets (state, facets) {
      state.facets = facets
    },

    initEntries (state, {facetOwnerType, entries}) {
      state.facetOwnerType = facetOwnerType
      state.entries = entries

      state.selectedFacets = []
      state.selectedFacetItems = []
      state.selectedFacetsWithoutEntries = []
      state.facetItemFilters = []

      state.navigationIsSelected = false
      state.selectedNavigationItem = null
    },

    initSelectedFacets (state) {
      const mainFacet = state.facets.find(facet => facet.main_facet_of === state.facetOwnerType)
      if (mainFacet) {
        state.selectedFacets = [mainFacet]
      }
    },

    toggleFacetSelection (state, facet) {
      if (facetIsSelected(state, facet)) {
        state.selectedFacets = state.selectedFacets.filter(f => f !== facet)

        state.selectedFacetItems = state.selectedFacetItems.filter(fi => fi.facet !== facet)
        state.selectedFacetsWithoutEntries = state.selectedFacetsWithoutEntries.filter(i => i !== facet)
      } else {
        state.selectedFacets = state.facets.filter(f => {
          return state.selectedFacets.includes(f) || facet === f
        })
      }
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

    initFilteredEntries (state) {
      state.filteredEntries = getFilteredEntries(state)
      state.filteredEntriesWithoutNavigation = getFilteredEntriesWithoutNavigation(state)
    },

    toggleNavigationSelection (state) {
      state.navigationIsSelected = !state.navigationIsSelected

      if (!state.navigationIsSelected) {
        state.selectedNavigationItem = null
      }
    },

    toggleNavigationItemSelection (state, navigationItem) {
      if (state.selectedNavigationItem === navigationItem) {
        // item deselected
        if (navigationItem.parent) {
          // select parent
          state.selectedNavigationItem = navigationItem.parent
        } else {
          // select none
          state.selectedNavigationItem = null
        }
      } else if (state.selectedNavigationItem && state.selectedNavigationItem.parent === navigationItem) {
        // parent of selected item deselected
        state.selectedNavigationItem = null
      } else {
        // any selected
        state.selectedNavigationItem = navigationItem
      }
    }
  },

  actions: {
    show ({commit}, show) {
      commit('show', show)
    },

    initFacets ({commit, dispatch}, facets) {
      commit('initFacets', facets)
      commit('initSelectedFacets')

      commit('initFilteredEntries')
    },

    initEntries ({commit, dispatch}, {facetOwnerType, entries}) {
      commit('initEntries', {facetOwnerType, entries})
      commit('initSelectedFacets')

      commit('initFilteredEntries')
    },

    facetItemClick ({commit, dispatch}, facetItem) {
      commit('toggleFacetItemSelection', facetItem)

      commit('initFilteredEntries')
      dispatch('computeFacetItemFilters')

      window.scrollTo(0, 0)
    },

    selectOrDeselectFacet ({commit, dispatch}, facet) {
      commit('toggleFacetSelection', facet)

      commit('initFilteredEntries')
      dispatch('computeFacetItemFilters')

      window.scrollTo(0, 0)
    },

    facetWithoutEntriesClick ({commit, dispatch}, facet) {
      commit('toggleFacetWithoutEntriesSelection', facet)

      commit('initFilteredEntries')
      dispatch('computeFacetItemFilters')

      window.scrollTo(0, 0)
    },

    filteredFacetItemClick ({state, dispatch}, facetItem) {
      if (facetItem._isFacetWithoutEntry) {
        dispatch('facetWithoutEntriesClick', facetItem.facet)
      } else {
        dispatch('facetItemClick', facetItem)
      }
    },

    entryFacetItemsSaved ({commit}) {
      commit('initFilteredEntries')
    },

    computeFacetItemFilters ({state, commit}) {
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
    },

    selectOrDeselectNavigation ({commit}) {
      commit('toggleNavigationSelection')

      commit('initFilteredEntries')
    },

    selectOrDeselectNavigationItem ({commit}, navigationItem) {
      commit('toggleNavigationItemSelection', navigationItem)

      commit('initFilteredEntries')
    }
  }
}
