<template>
  <div :class="['entryNavigationItems', {empty: isEmpty}]">
    <div v-if="loading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Navigation
    </div>

    <div v-else class="items">
      <div v-for="navigationItem in entry.navigation_items" :key="navigationItem.id" v-if="displayNavigationItem(navigationItem)">
        <entry-navigation-item :navigationItem="navigationItem" :click="false" />
      </div>

      <div class="navigationItemSelectorLink">
        <a href="" ref="trigger" class="inlineEditLink" @click.prevent="openNavigationSelector">
          {{ entry.navigation_items.length ? 'Ändern' : 'Navigation hinzufügen' }}
        </a>

        <pop-up-selector :trigger="$refs.trigger" diffX="0" @close="hideNavigationSelector" v-if="navigationSelectorIsOpen">
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
  props: ['entry'],

  data () {
    return {
      navigation: null,
      loading: false,
      navigationSelectorIsOpen: false
    }
  },

  computed: {
    isEmpty () {
      return !this.entry.navigation_items.length
    }
  },

  methods: {
    displayNavigationItem (navigationItem) {
      if (navigationItem.sub_items.length) {
        return !navigationItem.sub_items.some(subItem => this.entry.navigation_items.includes(subItem))
      }
      return true
    },

    openNavigationSelector () {
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
      this.loading = true
      Promise.all([
        this.entry.$rels.navigation_items.refetch()
      ]).then(() => {
        this.$store.dispatch('entryListFilters/entryFacetItemsSaved')
        this.loading = false
      })
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
