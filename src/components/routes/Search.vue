<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Search {{ numResultsString }}</h2>
        </div>
        <div>
          <form @submit.prevent="search">
            <div class="input-field">
              <input type="text" id="searchterm" ref="search" class="validate" v-model="keyword" @input="livesearch">
              <label for="searchterm">Suche im Titel</label>
            </div>
            <button class="btn waves-effect waves-light" type="submit">Suchen</button>
          </form>
        </div>
        <div>
          <p v-if="loading">
            <spinner :show="true" :width="1" :radius="5" :length="3" /> Suche Einträge
          </p>
          <div v-else>
            <span v-if="status">{{ status }}</span>
            <entry-list-items
              :items="items"
              :sort-function="sortByTitle"
              :options="{pagination: true}"
              v-else-if="items">
            </entry-list-items>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import EntryListItems from '@/components/EntryListItems'
import sortByTitle from '@/helpers/sort-by-title'
import Search from '@/resources/Search'
import Spinner from '@/components/Spinner'

export default {
  data () {
    return {
      items: null,
      status: null,
      keyword: '',
      sortByTitle,
      loading: false,
      debounceTimeout: null
    }
  },

  methods: {
    search () {
      this.loading = true
      this.status = 'Suche Einträge'
      Search.find(this.keyword).then(result => {
        this.status = result.length ? null : '0 Ergebnisse'
        this.items = result
        this.loading = false
      })
    },

    livesearch () {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }

      this.debounceTimeout = setTimeout(() => {
        if (this.keyword.length >= 3) {
          this.search()
        }
      }, 500)
    }
  },

  computed: {
    numResultsString () {
      return this.items ? `(${this.items.length} Treffer)` : ''
    }
  },

  mounted () {
    this.$refs.search.focus()
  },

  components: {
    EntryListItems,
    Spinner
  }
}
</script>
