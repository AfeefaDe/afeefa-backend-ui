<template>
  <entry-list
    :items="items"
    :numItems="numItems"
    addEntryButton="events.new"
    :messages="messages">

    <div slot="items">
      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <entry-list-items
          slot="upcomingEventsTab"
          :items="items"
          :sort-function="sortFunction"
          :options="{filter: true, pagination: true, event_date: true}"
          :sort-order="sortOrder">
        </entry-list-items>

        <entry-list-items
          slot="pastEventsTab"
          :items="items"
          :sort-function="sortFunction"
          :options="{filter: true, pagination: true, event_date: true}"
          :sort-order="sortOrder">
        </entry-list-items>
      </tab-bar>
    </div>

  </entry-list>
</template>


<script>
import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByDateMixin from '@/helpers/sort-by-date-mixin'
import Events from '@/resources/Events'
import TabBar from '@/components/TabBar'
import EntryListMixin from '@/components/mixins/EntryListMixin'
import EntryListItems from '@/components/entry/EntryListItems'
import { mapState } from 'vuex'

export default {
  mixins: [EntryListMixin],

  data () {
    return {
      Resource: Events,
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
      numEvents: state => state.navigation.numEvents
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

      this.items = null
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
    }
  },

  components: {
    EntryListItems,
    TabBar
  }
}
</script>
