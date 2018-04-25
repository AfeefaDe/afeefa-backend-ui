import FacetItem from '@/models/FacetItem'

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
  }
}
