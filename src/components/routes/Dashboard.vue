<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <search-items :modifyRoute="false"></search-items>
      </div>
    </div>

    <div class="col s12 m12">
      <div class="mainCard">
        <afeefa-header class="small">
          <router-link :to="{name: 'todos'}" slot="title">{{ $t('headlines.todos') }} ({{ numTodos }})</router-link>
        </afeefa-header>

        <div>
          <entry-list-items
            :items="todos"
            :isLoading="todosLoading"
            :limit="5"
            :sort-function="todosSort"
            :options="{updated_at: true, annotations: true}">
          </entry-list-items>
          <router-link :to="{name: 'todos'}" v-if="!todosLoading">{{ $t('status.all') }} {{ $t('headlines.todos') }}</router-link>
        </div>
      </div>
    </div>

    <div class="col s12 m6">
      <div class="mainCard">
        <afeefa-header class="small">
          <router-link :to="{name: 'orgas.list'}" slot="title">{{ $tc('headlines.organisations', numOrgas) }} ({{ numOrgas }})</router-link>
          <router-link :to="{name: 'orgas.new'}" slot="buttons" class="btn btn-medium green">
            <i class="material-icons left">add</i>
            {{$t('buttons.add')}}
          </router-link>
        </afeefa-header>

        <div>
          <entry-list-items
            :items="orgas"
            :isLoading="orgasLoading"
            :limit="5"
            :sort-function="orgaSort"
            :options="{created_at: true}">
          </entry-list-items>
          <router-link :to="{name: 'orgas.list'}" v-if="!orgasLoading">{{ $t('status.all') }} {{ $tc('headlines.organisations', numOrgas) }}</router-link>
        </div>
      </div>
    </div>

    <div class="col s12 m6">
      <div class="mainCard">
        <afeefa-header class="small">
          <router-link :to="{name: 'events.list'}" slot="title">{{ $tc('headlines.events', numEvents) }} ({{numEvents}})</router-link>
          <router-link :to="{name: 'events.new'}" slot="buttons" class="btn btn-medium green">
            <i class="material-icons left">add</i>
            {{$t('buttons.add')}}
          </router-link>
        </afeefa-header>

        <div>
          <entry-list-items
            :items="events"
            :isLoading="eventsLoading"
            :limit="5"
            :sort-function="eventsSort"
            :options="{created_at: true, event_date: true}">
          </entry-list-items>
          <router-link :to="{name: 'events.list'}" v-if="!eventsLoading">{{ $t('status.all') }} {{ $tc('headlines.events', 2) }}</router-link>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import EntryListItems from '@/components/entry/EntryListItems'
import SearchItems from '@/components/SearchItems'
import sortByUpdatedAt from '@/helpers/sort-by-updated-at'
import sortByCreatedAt from '@/helpers/sort-by-created-at'
import { mapState } from 'vuex'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import TodosQuery from '@/resources/Todos'

export default {
  data () {
    return {
      todos: [],
      todosSort: sortByUpdatedAt,
      todosLoading: true,

      orgas: [],
      orgasLoading: true,
      orgaSort: sortByCreatedAt,

      events: [],
      eventsLoading: true,
      eventsSort: sortByCreatedAt
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
  },

  components: {
    EntryListItems, SearchItems
  }
}
</script>
