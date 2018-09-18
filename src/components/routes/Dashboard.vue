<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <search-items :modifyRoute="false"></search-items>
      </div>
    </div>

    <div class="col s12 m6">
      <div class="mainCard">
        <afeefa-header class="small">
          <router-link :to="{name: 'todos'}" slot="title">{{ $tc('headlines.newest') }} {{ $t('headlines.todos') }}</router-link>
        </afeefa-header>

        <div>
          <entry-list-items
            :items="todos"
            :lazyLoad="true"
            :isLoading="todosLoading"
            :limit="15"
            :customSortOrders="[{ sort: todosSort }]"
            :options="{annotations: true}">
          </entry-list-items>
          <router-link :to="{name: 'todos'}" v-if="!todosLoading">{{ $t('status.all') }} {{ $t('headlines.todos') }} ({{ numTodos }})</router-link>
        </div>
      </div>
    </div>

    <div class="col s12 m6">
      <div class="mainCard">
        <afeefa-header class="small">
          <router-link :to="{name: 'offers.list'}" slot="title">{{ $tc('headlines.newest') }} {{ $tc('offers.name', numOffers) }}</router-link>
          <router-link :to="{name: 'offers.new'}" slot="buttons" class="btn btn-medium green">
            <i class="material-icons left">add</i>
            {{$t('buttons.add')}}
          </router-link>
        </afeefa-header>

        <div>
          <entry-list-items
            :items="offers"
            :lazyLoad="true"
            :isLoading="offersLoading"
            :limit="5"
            :customSortOrders="[{ sort: offerSort, field: 'created_at' }]"
            :options="{created_at: true}">
          </entry-list-items>
          <router-link :to="{name: 'offers.list'}" v-if="!offersLoading">{{ $t('status.all') }} {{ $tc('offers.name', numOffers) }} ({{ numOffers }})</router-link>
        </div>
      </div>

      <div class="mainCard">
        <afeefa-header class="small">
          <router-link :to="{name: 'orgas.list'}" slot="title">{{ $tc('headlines.newest') }} {{ $tc('headlines.organisations', numOrgas) }}</router-link>
          <router-link :to="{name: 'orgas.new'}" slot="buttons" class="btn btn-medium green">
            <i class="material-icons left">add</i>
            {{$t('buttons.add')}}
          </router-link>
        </afeefa-header>

        <div>
          <entry-list-items
            :items="orgas"
            :lazyLoad="true"
            :isLoading="orgasLoading"
            :limit="5"
            :customSortOrders="[{ sort: orgaSort, field: 'created_at' }]"
            :options="{created_at: true}">
          </entry-list-items>
          <router-link :to="{name: 'orgas.list'}" v-if="!orgasLoading">{{ $t('status.all') }} {{ $tc('headlines.organisations', numOrgas) }} ({{ numOrgas }})</router-link>
        </div>
      </div>

      <div class="mainCard">
        <afeefa-header class="small">
          <router-link :to="{name: 'events.list'}" slot="title">{{ $tc('headlines.newest') }} {{ $tc('headlines.events', numEvents) }}</router-link>
          <router-link :to="{name: 'events.new'}" slot="buttons" class="btn btn-medium green">
            <i class="material-icons left">add</i>
            {{$t('buttons.add')}}
          </router-link>
        </afeefa-header>

        <div>
          <entry-list-items
            :items="events"
            :lazyLoad="true"
            :isLoading="eventsLoading"
            :limit="5"
            :customSortOrders="[{ sort: eventsSort, field: 'created_at' }]"
            :options="{created_at: true, event_date: true}">
          </entry-list-items>
          <router-link :to="{name: 'events.list'}" v-if="!eventsLoading">{{ $t('status.all') }} {{ $tc('headlines.events', 2) }} ({{numEvents}})</router-link>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import EntryListItems from '@/components/entry/list/EntryListItems'
import SearchItems from '@/components/SearchItems'
import { sortByAnnotationsUpdatedAt } from '@/helpers/sort-by-updated-at'
import sortByCreatedAt from '@/helpers/sort-by-created-at'
import { mapState } from 'vuex'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Offer from '@/models/Offer'
import TodosQuery from '@/resources/Todos'

export default {
  data () {
    return {
      todos: [],
      todosLoading: true,
      todosSort: sortByAnnotationsUpdatedAt,

      orgas: [],
      orgasLoading: true,
      orgaSort: sortByCreatedAt,

      events: [],
      eventsLoading: true,
      eventsSort: sortByCreatedAt,

      offers: [],
      offersLoading: true,
      offerSort: sortByCreatedAt
    }
  },

  computed: mapState({
    numTodos: state => state.navigation.numTodos,
    numOffers: state => state.navigation.numOffers,
    numOrgas: state => state.navigation.numOrgas,
    numEvents: state => state.navigation.numEvents ? state.navigation.numEvents.all : 0
  }),

  created () {
    TodosQuery.getAll().then(todos => {
      this.todos = todos
      this.todosLoading = false
    })

    Orga.Query.getAll().then(orgas => {
      this.orgas = orgas
      this.orgasLoading = false
    })

    Event.Query.getAll().then(events => {
      this.events = events
      this.eventsLoading = false
    })

    Offer.Query.getAll().then(offers => {
      this.offers = offers
      this.offersLoading = false
    })
  },

  components: {
    EntryListItems, SearchItems
  }
}
</script>

<style lang="scss" scoped>
.entryListItems {
  margin: .5em 0;
}
</style>
