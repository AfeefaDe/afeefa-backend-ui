<template>
  <div :class="['entryNavigationItems', {empty: isEmpty}]">
    <div v-if="isReloading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Navigation
    </div>

    <div v-else class="items">
      <div v-for="navigationItem in entry.navigation_items" :key="navigationItem.id" v-if="displayNavigationItem(navigationItem)">
        <entry-navigation-item :navigationItem="navigationItem" :click="false" />
      </div>

      <div class="navigationItemSelectorLink">
        <a href="" ref="trigger" class="inlineEditLink" @click.prevent="openNavigationSelector($event.target)" v-if="!isEmpty || !hideAddLink">
          {{ !isEmpty ? 'Ändern' : 'Navigation hinzufügen' }}
        </a>

        <pop-up-selector :trigger="customTrigger || $refs.trigger" diffX="0" @close="hideNavigationSelector" v-if="navigationSelectorIsOpen">
          <navigation-item-selector-content :selectedNavigationItems="entry.navigation_items" @click="navigationItemSelected" />
        </pop-up-selector>
      </div>
    </div>
  </div>
</template>

<script>
import EntryNavigationItem from '@/components/entry/facets/EntryNavigationItem'
import PopUpSelector from '@/components/PopUpSelector'
import NavigationItemSelectorContent from '@/components/facet/NavigationItemSelectorContent'
import Spinner from '@/components/Spinner'

export default {
  props: ['entry', 'hideAddLink'],

  data () {
    return {
      navigation: null,
      isReloading: 0,
      navigationSelectorIsOpen: false,
      isEntryDetailSectionContent: true,
      customTrigger: null
    }
  },

  computed: {
    isEmpty () {
      return !this.entry.navigation_items.length
    },

    editLinkTitle () {
      if (this.isEdit) {
        return null
      }
      return this.isEmpty ? 'Hinzufügen' : null
    }
  },

  methods: {
    editLinkClick (triggerButton) {
      this.openNavigationSelector(triggerButton)
    },

    displayNavigationItem (navigationItem) {
      if (navigationItem.sub_items.length) {
        return !navigationItem.sub_items.some(subItem => this.entry.navigation_items.includes(subItem))
      }
      return true
    },

    openNavigationSelector (customTrigger) {
      this.customTrigger = customTrigger
      this.navigationSelectorIsOpen = true
    },

    hideNavigationSelector () {
      this.navigationSelectorIsOpen = false
    },

    navigationItemSelected (navigationItem) {
      this.hideNavigationSelector()

      this.save(navigationItem)
    },

    save (navigationItem) {
      this.entry.$rels.navigation_items.Query.attachMany([navigationItem]).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Navigation wurden gespeichert.'
          })
          this.navigationSaved()
        }
      })
    },

    navigationSaved () {
      this.isReloading = 1

      // show isReloading spinner min 500 ms for good ux
      setTimeout(() => {
        this.isReloading++
        this.setItemsAfterLoading()
      }, 200)

      Promise.all([
        this.entry.$rels.navigation_items.refetch()
      ]).then(() => {
        this.isReloading++
        this.setItemsAfterLoading()
      })
    },

    setItemsAfterLoading () {
      if (this.isReloading > 2) {
        this.isReloading = false
        if (!this.facets) { // no facets === using facet filters, todo
          this.$store.dispatch('entryListFilters/entryFacetItemsSaved')
        }
      }
    }
  },

  components: {
    EntryNavigationItem,
    PopUpSelector,
    NavigationItemSelectorContent,
    Spinner
  }
}
</script>


<style lang="scss" scoped>
.entryNavigationItems {
  .items {
    display: flex;
    align-items: center;
  }
}

.navigationItemSelectorLink:not(:first-child) {
  margin-left: .7em;
}

</style>
