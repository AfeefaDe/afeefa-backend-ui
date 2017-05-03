<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">
            <router-link :to="{name: 'orgas.list'}">{{ $t('headlines.todos') }} ({{ numTodos }})</router-link>
          </h2>
        </div>
        <div>
          <entry-list-items
            :items="todos"
            :limit="5"
            :sort-function="todosSort"
            :options="{updated_at: true, annotations: true}">
          </entry-list-items>
          <router-link :to="{name: 'todos'}">{{ $t('status.all') }} {{ $t('headlines.todos') }}</router-link>
        </div>
      </div>
    </div>

    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">
            <router-link :to="{name: 'orgas.list'}">{{ $t('headlines.organisations') }} ({{ numOrgas }})</router-link>
          </h2>
          <router-link :to="{name: 'orgas.new'}"  class="mainCard__headerButton">
            {{$t('buttons.add')}}
            <i class="material-icons">add</i>
          </router-link>
        </div>
        <div>
          <entry-list-items
            :items="orgas"
            :limit="5"
            :sort-function="orgaSort"
            :options="{created_at: true}">
          </entry-list-items>
          <router-link :to="{name: 'orgas.list'}">{{ $t('status.all') }} {{ $t('headlines.organisations') }}</router-link>
        </div>
      </div>
    </div>

    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">
            <router-link :to="{name: 'events.list'}">{{ $tc('headlines.events', 2) }} ({{numEvents}})</router-link>
          </h2>
          <router-link :to="{name: 'events.new'}"  class="mainCard__headerButton">
            {{$t('buttons.add')}}
            <i class="material-icons">add</i>
          </router-link>
        </div>
        <div>
          <entry-list-items
            :items="events"
            :limit="5"
            :sort-function="eventsSort"
            :options="{date_start: true}">
          </entry-list-items>
          <router-link :to="{name: 'events.list'}">{{ $t('status.all') }} {{ $tc('headlines.events', 2) }}</router-link>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import EntryListItems from '@/components/EntryListItems'
import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByUpdatedAt from '@/helpers/sort-by-updated-at'
import sortByCreatedAt from '@/helpers/sort-by-created-at'
import { mapState } from 'vuex'
import Events from '@/resources/Events'
import Orgas from '@/resources/Orgas'
import Todos from '@/resources/Todos'

export default {
  data () {
    return {
      todos: null,
      todosSort: sortByUpdatedAt,
      orgas: null,
      orgaSort: sortByCreatedAt,
      events: null,
      eventsSort: sortByDateStart
    }
  },

  computed: mapState({
    numTodos: state => state.navigation.numTodos,
    numOrgas: state => state.navigation.numOrgas,
    numEvents: state => state.navigation.numEvents
  }),

  created () {
    Todos.getAll().then(todos => {
      this.todos = todos
    })

    Orgas.getAll().then(orgas => {
      this.orgas = orgas
    })

    Events.getAll().then(events => {
      this.events = events
    })
  },

  components: {
    EntryListItems
  }
}
</script>
