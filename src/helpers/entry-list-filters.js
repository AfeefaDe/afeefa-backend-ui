import FacetItem from '@/models/FacetItem'
import NavigationItem from '@/models/NavigationItem'

export default {
  getEntriesForFacet (facet, entries) {
    return entries.filter(entry => {
      return entry.facet_items.find(facetItem => {
        return facetItem.facet === facet
      })
    })
  },

  getEntriesForFacetItem (facetItem, entries) {
    return entries.filter(entry => {
      return entry.facet_items.includes(facetItem)
    })
  },

  getEntriesForNavigationItem (navigationItem, entries) {
    return entries.filter(entry => {
      return entry.navigation_items.includes(navigationItem)
    })
  },

  getEntriesForActiveState (state, entries) {
    if (state.value === 'all') {
      return entries
    }
    return entries.filter(entry => {
      return entry.active === (state.value === 'active')
    })
  },

  getEntriesWithoutNavigationItem (entries) {
    return entries.filter(entry => {
      return entry.navigation_items.length === 0
    })
  },

  getEntriesForFacetItemsAndWithoutFacets (facetItems, facets, entries) {
    let filteredEntries = entries
    if (facetItems.length) {
      filteredEntries = entries.filter(entry => {
        return facetItems.every(facetItem => {
          return entry.facet_items.includes(facetItem)
        })
      })
    }

    if (facets.length) {
      filteredEntries = filteredEntries.filter(entry => {
        return !entry.facet_items.find(facetItem => {
          return facets.filter(facet => {
            return facetItem.facet === facet
          }).length > 0
        })
      })
    }

    return filteredEntries
  },

  getEntriesWithoutFacet (facet, entries) {
    return entries.filter(entry => {
      return !entry.facet_items.find(facetItem => {
        return facetItem.facet === facet
      })
    })
  },

  createFacetItemEntriesWithoutFacet (facet) {
    const facetItem = new FacetItem()
    facetItem.id = 'facet' + facet.id
    facetItem.facet = facet
    facetItem.title = 'Nicht zugeordnet'
    facetItem.color = facet.color
    facetItem._isFacetWithoutEntry = true
    return facetItem
  },

  createNavigationItemWithoutNavigation (navigation) {
    const navigationItem = new NavigationItem()
    navigationItem.id = 'navigation' + navigation.id
    navigationItem.navigation = navigation
    navigationItem.title = 'Nicht zugeordnet'
    navigationItem.color = '#999999'
    navigationItem._isNavigationWithoutEntry = true
    return navigationItem
  },

  getDisplayedFacetItemsForFacets (selectedFacetItems, facets) {
    let items = []
    facets.forEach(facet => {
      facet.facet_items.forEach(facetItem => {
        const subItems = []
        facetItem.sub_items.forEach(subItem => {
          if (selectedFacetItems.includes(subItem)) {
            subItems.push(subItem)
          }
        })
        if (subItems.length) {
          items = items.concat(subItems)
        } else if (selectedFacetItems.includes(facetItem)) {
          items.push(facetItem)
        }
      })
    })
    return items
  },

  getDisplayedFacetItemsByInsertion (selectedFacetItems, facets) {
    let items = []
    selectedFacetItems
      .filter(facetItem => facets.includes(facetItem.facet))
      .forEach(facetItem => {
        if (facetItem.parent) {
          items.push(facetItem)
        } else {
          const hasSub = facetItem.sub_items.some(subItem => selectedFacetItems.includes(subItem))
          if (!hasSub) {
            items.push(facetItem)
          }
        }
      })
    return items
  },

  getFacetsForOwnerType (facets, facetOwnerType) {
    let mainFacet = null
    facets = facets.filter(facet => {
      if (facet.main_facet_of === facetOwnerType) {
        mainFacet = facet
        return false
      }
      return facet.owner_types.includes(facetOwnerType)
    })
    if (mainFacet) {
      facets.unshift(mainFacet)
    }
    return facets
  }
}
