<template>
  <div>
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Kategorien</h2>
        </div>

        <input type="text" v-model="newFacet.title" @keyup.enter="addFacet">
        <button class="btn waves-effect waves-light saveButton" type="submit" @click="addFacet">
          <i class="material-icons left">done</i>
          Hinzufügen
        </button>

        <div>
          <div v-for="facet in facets" :key="facet.id">
            <router-link :to="{name: 'facets.show', params: {id: facet.id}}">
              <h4>{{ facet.title }}</h4>
              <ul>
                <li v-for="facetItem in facet.facet_items" :key="facetItem.id">
                  {{ facetItem.title }}
                </li>
              </ul>
            </router-link>
            <router-link :to="{name: 'facets.edit', params: {id: facet.id}}">Ändern</router-link>
            <a href="" @click.prevent="removeFacet(facet)">Löschen</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Facet from '@/models/Facet'

export default {
  data () {
    return {
      facets: [],
      newFacet: new Facet()
    }
  },

  created () {
    this.loadFacets()
  },

  methods: {
    loadFacets () {
      Facet.getAll().then(facets => {
        this.facets = facets
      })
    },

    addFacet () {
      Facet.save(this.newFacet).then(facet => {
        if (facet) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde hinzugefügt'
          })
          this.loadFacets()
        }
      })
      this.newFacet = new Facet()
    },

    removeFacet (facet) {
      this.$store.dispatch('messages/showDialog', {
        title: 'Facette löschen',
        message: 'Soll die Facette gelöscht werden?\n\nAlle Akteure verlieren die Facette.'
      }).then(result => {
        if (result === 'yes') {
          Facet.delete(facet).then(deleted => {
            if (deleted) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Die Facette wurde gelöscht'
              })
              this.loadFacets()
            }
          })
        }
      })
    }
  }
}
</script>

<style>
ul {
  padding-left: 20px;
}
li {
  list-style-type: circle;
}
</style>
