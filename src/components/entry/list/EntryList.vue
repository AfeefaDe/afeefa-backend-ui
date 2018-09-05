<template>
    <afeefa-page>

      <afeefa-header slot="header">
        <div slot="title">
          {{ messages.headline() }} ({{ currentNumItems }})
        </div>

        <div slot="buttons">
          <router-link v-if="addEntryButton" :to="{name: addEntryButton}" class="btn green btn-medium">
            <i class="material-icons left">add</i>
            {{$t('buttons.add')}}
          </router-link>
        </div>
      </afeefa-header>

      <div slot="content">
        <slot name="items">
          <entry-list-items
            :items="items"
            :lazyLoad="lazyLoad"
            :isLoading="isLoading"
            :customSortOrders="customSortOrders"
            :options="options">
            <slot slot="navigation"></slot>
          </entry-list-items>
        </slot>
      </div>

    </afeefa-page>
</template>


<script>
import EntryListItems from '@/components/entry/list/EntryListItems'

export default {
  props: ['items', 'lazyLoad', 'isLoading', 'numItems', 'facetOwnerType', 'customSortOrders', 'options', 'messages', 'addEntryButton'],

  computed: {
    currentNumItems () {
      return this.numItems || this.items.length
    }
  },

  watch: {
    items () {
      this.$store.dispatch('entryListFilters/initEntries', {facetOwnerType: this.facetOwnerType, entries: this.items})
    }
  },

  components: {
    EntryListItems
  }
}
</script>
