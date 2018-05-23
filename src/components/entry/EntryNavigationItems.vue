<template>
  <div :class="['entryNavigationItems', {empty: isEmpty}]">
    <div v-if="loading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Navigation
    </div>

    <div v-else-if="navigation" class="items">
      <div v-for="navigationItem in entry.navigation_items" :key="navigationItem.id" v-if="displayNavigationItem(navigationItem)">
        <navigation-item-view :navigationItem="navigationItem" :click="false" />
      </div>

      <div class="navigationItemSelectorLink">
        <a href="" ref="trigger" class="inlineEditLink" @click.prevent="openNavigationSelector">
          {{ entry.navigation_items.length ? 'Ändern' : 'Navigation hinzufügen' }}
        </a>

        <pop-up-selector :trigger="$refs.trigger" diffX="0" @close="hideNavigationSelector" v-if="navigationSelectorIsOpen">
          <navigation-items-tree @click="navigationItemSelected" />
        </pop-up-selector>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '@/models/Navigation'
import NavigationItemView from '@/components/fe_navigation/FeNavigationItemView'
import PopUpSelector from '@/components/PopUpSelector'
import NavigationItemsTree from '@/components/fe_navigation/FeNavigationItemsTree'
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

  created () {
    Navigation.Query.get().then(navigation => {
      this.navigation = navigation
    })
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
        this.$store.dispatch('facetFilters/entryFacetItemsSaved')
        this.loading = false
      })

      Navigation.Query.get()
    }
  },

  components: {
    NavigationItemView,
    PopUpSelector,
    NavigationItemsTree,
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
