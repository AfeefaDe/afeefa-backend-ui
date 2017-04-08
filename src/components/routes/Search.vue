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
              <input type="text" id="searchterm" ref="search" class="validate" v-model="keyword">
              <label for="searchterm">Suche im Titel</label>
            </div>
            <button class="btn waves-effect waves-light" type="submit">Suchen</button>
          </form>
        </div>
        <div>
          <p v-if="status">{{ status }}</p>
          <div v-else>
            <entry-list-items
              :items="items"
              :sort-function="sortByTitle"
              :options="{pagination: true}"
              v-if="items">
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

export default {
  data () {
    return {
      items: null,
      status: null,
      keyword: '',
      sortByTitle
    }
  },

  methods: {
    search () {
      this.status = 'Suche ... bitte warten ...'
      Search.find(this.keyword).then(result => {
        this.status = result.length ? null : '0 Ergebnisse'
        this.items = result
      }, error => {
        console.log(error)
      })
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
    EntryListItems
  }
}
</script>
