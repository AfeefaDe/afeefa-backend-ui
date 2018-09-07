import entryListFilters from '@/helpers/entry-list-filters'

function facetIsSelected (state, facet) {
  return state.selectedFacets.includes(facet)
}

function facetItemIsSelected (state, facetItem) {
  return state.selectedFacetItems.includes(facetItem)
}

function facetWithoutEntriesIsSelected (state, facet) {
  return state.selectedFacetsWithoutEntries.includes(facet)
}

function filterNavigationItems (state, entries) {
  if (state.selectedNavigationItem) {
    if (state.selectedNavigationItem._isNavigationWithoutEntry) {
      return entryListFilters.getEntriesWithoutNavigationItem(entries)
    } else {
      return entryListFilters.getEntriesForNavigationItem(state.selectedNavigationItem, entries)
    }
  } else {
    return entries
  }
}

function filterActiveState (state, entries) {
  if (state.selectedActiveState.value !== 'all') {
    entries = entries.filter(e => e.active === (state.selectedActiveState.value === 'active'))
  }
  return entries
}

function filterFacets (state, entries) {
  return entryListFilters.getEntriesForFacetItemsAndWithoutFacets(
    state.selectedFacetItems,
    state.selectedFacetsWithoutEntries,
    entries
  )
}

let initScheduled = false

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

    activeStates: [
      { name: 'Alle', value: 'all' },
      { name: 'Aktiv', value: 'active' },
      { name: 'Inaktiv', value: 'inactive' }
    ],
    selectedActiveState: null,

    filteredEntries: [],
    filteredEntriesWithoutNavigation: [],
    filteredEntriesWithoutActive: []
  },

  getters: {
    selectableFacets: state => {
      return entryListFilters.getFacetsForOwnerType(state.facets, state.facetOwnerType)
    }
  },

  mutations: {
    initFacets (state, facets) {
      state.facets = facets
    },

    initFilteredEntries (state) {
      if (!state.entries.length) {
        state.filteredEntriesWithoutNavigation = []
        state.filteredEntries = []
        state.filteredEntriesWithoutActive = []
        return
      }

      if (initScheduled) {
        return
      }

      initScheduled = true

      setTimeout(() => {
        const entriesFilteredByFacetItems = filterFacets(state, state.entries)
        state.filteredEntriesWithoutActive = filterNavigationItems(state, entriesFilteredByFacetItems)
        state.filteredEntriesWithoutNavigation = filterActiveState(state, entriesFilteredByFacetItems)
        state.filteredEntries = state.filteredEntriesWithoutActive.filter(entry => state.filteredEntriesWithoutNavigation.includes(entry))
        initScheduled = false
      })
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

      state.selectedActiveState = state.activeStates[0]
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

        // state.selectedFacetItems = state.selectedFacetItems.filter(fi => fi.facet !== facet)
        // state.selectedFacetsWithoutEntries = state.selectedFacetsWithoutEntries.filter(i => i !== facet)
      } else {
        state.selectedFacets = state.facets.filter(f => {
          return state.selectedFacets.includes(f) || facet === f
        })
      }
    },

    toggleFacetItemSelection (state, facetItem) {
      if (!facetIsSelected(state, facetItem.facet)) {
        state.selectedFacets.push(facetItem.facet)
      }

      if (facetItemIsSelected(state, facetItem)) {
        state.selectedFacetItems = state.selectedFacetItems.filter(fi => fi !== facetItem)
      } else {
        state.selectedFacetItems.push(facetItem)
      }
    },

    toggleFacetWithoutEntriesSelection (state, facet) {
      if (!facetIsSelected(state, facet)) {
        state.selectedFacets.push(facet)
      }

      if (facetWithoutEntriesIsSelected(state, facet)) {
        state.selectedFacetsWithoutEntries = state.selectedFacetsWithoutEntries.filter(i => i !== facet)
      } else {
        state.selectedFacetsWithoutEntries.push(facet)
      }
    },

    setFacetItemFilters (state, facetItemFilters) {
      state.facetItemFilters = facetItemFilters
    },

    toggleNavigationSelection (state) {
      state.navigationIsSelected = !state.navigationIsSelected

      // if (!state.navigationIsSelected) {
      //   state.selectedNavigationItem = null
      // }
    },

    toggleNavigationItemSelection (state, navigationItem) {
      state.navigationIsSelected = true

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
    },

    setActiveState (state, activeState) {
      state.selectedActiveState = activeState
    }
  },

  actions: {
    initFacets ({state, commit}, facets) {
      if (state.facets.length) {
        return
      }
      commit('initFacets', facets)
      commit('initSelectedFacets')
      commit('initFilteredEntries')
    },

    initEntries ({commit}, {facetOwnerType, entries}) {
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

    filteredFacetItemClick ({dispatch}, facetItem) {
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
            const facetItem = entryListFilters.createFacetItemEntriesWithoutFacet(facet)
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
    },

    setActiveState ({state, commit}, activeState) {
      commit('setActiveState', activeState)

      commit('initFilteredEntries')
    },

    unsetActiveState ({state, dispatch}) {
      dispatch('setActiveState', state.activeStates[0])
    }
  }
}
