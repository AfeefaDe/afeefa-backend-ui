<template>
  <entry-list
    :items="items"
    :isLoading="isLoading"
    :numItems="numItems"
    facetEntryType="Event"
    addEntryButton="events.new"
    :messages="messages">

    <div slot="sidebar" class="mainCard sidebar" v-if="items.length">
      <facet-item-filter-bar type="Event" :entries="items" />
    </div>

    <div slot="items">
      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <entry-list-items
          slot="upcomingEventsTab"
          :items="filteredEntries"
          :isLoading="isLoading"
          :sort-function="sortFunction"
          :options="{facetFilter: true, filter: true, pagination: true, event_date: true}"
          :sort-order="sortOrder">
        </entry-list-items>

        <entry-list-items
          slot="pastEventsTab"
          :items="filteredEntries"
          :isLoading="isLoading"
          :sort-function="sortFunction"
          :options="{facetFilter: true, filter: true, pagination: true, event_date: true}"
          :sort-order="sortOrder">
        </entry-list-items>
      </tab-bar>
    </div>

  </entry-list>
</template>


<script>
import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByDateMixin from '@/helpers/sort-by-date-mixin'
import Event from '@/models/Event'
import EntryListMixin from '@/components/mixins/EntryListMixin'
import EntryListItems from '@/components/entry/EntryListItems'
import { mapState } from 'vuex'
import FacetItemFilterBar from '@/components/facet/FacetItemFilterBar'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Query: Event.Query,
      sortFunction: null,
      sortOrder: null,
      currentTab: null,

      messages: {
        headline: () => {
          return this.$tc('headlines.events', 2)
        }
      }
    }
  },

  computed: {
    ...mapState({
      numEvents: state => state.navigation.numEvents,
      filteredEntries: state => state.facetFilters.filteredEntries
    }),

    numItems () {
      return this.numEvents.upcoming + this.numEvents.past
    },

    tabNames () {
      return [
        { name: 'upcomingEventsTab', hint: this.numEvents.upcoming },
        { name: 'pastEventsTab', hint: this.numEvents.past }
      ]
    }
  },

  methods: {
    beforeCreated () {
      this.currentTab = this.$route.query.tab || 'upcomingEventsTab'
    },

    setCurrentTab (tabName) {
      this.currentTab = tabName

      this.loadItems()
    },

    getQueryParams () {
      this.sortOrder = this.currentTab === 'upcomingEventsTab' ? 'ASC' : 'DESC'
      this.sortFunction = this.currentTab === 'pastEventsTab' ? sortByDateStart : sortByDateMixin

      if (this.currentTab === 'pastEventsTab') {
        return {'filter[date]': 'past'}
      } else {
        return {'filter[date]': 'upcoming'}
      }
    },

    itemsLoaded (entries) {
      this.$store.dispatch('facetFilters/initEntries', {type: 'Event', entries: this.items})
    }
  },

  components: {
    EntryListItems,
    FacetItemFilterBar
  }
}
</script>
