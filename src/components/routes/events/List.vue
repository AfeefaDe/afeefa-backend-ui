<template>
  <entry-list
    :items="items"
    :isLoading="isLoading"
    :numItems="numItems"
    facetOwnerType="Event"
    addEntryButton="events.new"
    :messages="messages">

    <div slot="items">
      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <entry-list-items
          slot="upcomingEvents"
          :items="filteredEntries"
          :lazyLoad="true"
          :isLoading="isLoading"
          :customSortOrders="customSortOrders"
          :options="{facetFilter: true, filter: true, sort: true, pagination: true, event_date: true, created_at: true, updated_at: true}">
        </entry-list-items>

        <entry-list-items
          slot="pastEvents"
          :items="filteredEntries"
          :lazyLoad="true"
          :isLoading="isLoading"
          :customSortOrders="customSortOrders"
          :options="{facetFilter: true, filter: true, sort: true, pagination: true, event_date: true, created_at: true, updated_at: true}">
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
import EntryListItems from '@/components/entry/list/EntryListItems'
import { mapState } from 'vuex'

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
      filteredEntries: state => state.entryListFilters.filteredEntries
    }),

    numItems () {
      return this.numEvents.upcoming + this.numEvents.past
    },

    tabNames () {
      return [
        { name: 'upcomingEvents', hint: this.numEvents.upcoming },
        { name: 'pastEvents', hint: this.numEvents.past }
      ]
    },

    customSortOrders () {
      return [
        { name: 'Datum', sort: this.sortFunction, order: this.sortOrder }
      ]
    }
  },

  methods: {
    beforeCreated () {
      this.currentTab = this.$route.query.tab || 'upcomingEvents'
    },

    setCurrentTab (tabName) {
      if (this.currentTab !== tabName) {
        this.currentTab = tabName
        this.$store.dispatch('entryListFilters/initEntries', {facetOwnerType: 'Event', entries: []})
        this.loadItems()
      }
    },

    getQueryParams () {
      this.sortOrder = this.currentTab === 'upcomingEvents' ? 'ASC' : 'DESC'
      this.sortFunction = this.currentTab === 'pastEvents' ? sortByDateStart : sortByDateMixin

      if (this.currentTab === 'pastEvents') {
        return {'filter[date]': 'past'}
      } else {
        return {'filter[date]': 'upcoming'}
      }
    }
  },

  components: {
    EntryListItems
  }
}
</script>
