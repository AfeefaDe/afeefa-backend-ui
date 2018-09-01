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
        <slot></slot>

        <slot name="items">
          <entry-list-items
            :items="items"
            :lazyLoad="lazyLoad"
            :isLoading="isLoading"
            :sort-function="sortFunction"
            :sort-order="sortOrder"
            :options="options">
          </entry-list-items>
        </slot>
      </div>

    </afeefa-page>
</template>


<script>
import EntryListItems from '@/components/entry/list/EntryListItems'

export default {
  props: ['items', 'lazyLoad', 'isLoading', 'numItems', 'facetOwnerType', 'sortFunction', 'sortOrder', 'options', 'messages', 'addEntryButton'],

  computed: {
    currentNumItems () {
      return this.numItems || this.items.length
    }
  },

  watch: {
    items (neu, alt) {
      this.$store.dispatch('facetFilters/initEntries', {facetOwnerType: this.facetOwnerType, entries: this.items})
    }
  },

  components: {
    EntryListItems
  }
}
</script>
