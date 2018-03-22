<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Kategorien</h2>
        </div>

        <div>
          <div v-for="facet in facets" :key="facet.id" class="facet">
            <div>
              <router-link :to="{name: 'facets.show', params: {id: facet.id}}" class="nav">
                <h4 class="title">{{ facet.title }}</h4>
                <span class="icon"><i class="material-icons">navigate_next</i></span>
              </router-link>
              <facet-item-tag-list :facetItems="facet.getAllFacetItems()" />
            </div>
          </div>
        </div>

        <div>
          <h4>Neue Kategorie erstellen</h4>
          <input type="text" placeholder="Titel" v-model="newFacet.title" @keyup.enter="addFacet">
          <button class="btn btn-small waves-effect waves-light saveButton" type="submit" @click="addFacet">
            <i class="material-icons left">done</i>
            Anlegen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Facet from '@/models/Facet'
import FacetItemTagList from '@/components/facet/FacetItemTagList'

export default {
  data () {
    return {
      facets: [],
      newFacet: new Facet(),
      editableFacets: {}
    }
  },

  created () {
    this.loadFacets()
  },

  methods: {
    editFacet (facet) {
      facet.__clone = facet.clone()
      Vue.set(this.editableFacets, facet.id, true)
    },

    cancelEditFacet (facet) {
      delete facet.__clone
      Vue.delete(this.editableFacets, facet.id)
    },

    isEditable (facet) {
      return !!this.editableFacets[facet.id]
    },

    loadFacets () {
      Facet.Query.getAll().then(facets => {
        this.facets = facets
      })
    },

    addFacet () {
      Facet.Query.save(this.newFacet).then(facet => {
        if (facet) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde hinzugefügt'
          })
          this.loadFacets()
        }
      })
    },

    updateFacet (facet) {
      Facet.Query.save(facet).then(facet => {
        if (facet) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde geändert.'
          })
        }
        this.cancelEditFacet(facet)
      })
    },

    removeFacet (facet) {
      this.$store.dispatch('messages/showDialog', {
        title: 'Facette löschen',
        message: 'Soll die Facette gelöscht werden?\n\nAlle Akteure verlieren die Facette.'
      }).then(result => {
        if (result === 'yes') {
          Facet.Query.delete(facet).then(deleted => {
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
  },

  components: {
    FacetItemTagList
  }
}
</script>

<style lang="scss" scoped>
.facet {
  border-bottom: 1px solid $gray20;
  padding: 1em 0;
}

.nav {
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: flex-end;
  word-break: break-word;
  hyphens: auto;
  .title {
    flex-grow: 2;
    font-size: 1.4em;
    margin: 0 0 0.6em;
    font-weight: 500;
    line-height: 120%;
  }
}

h4 {
  font-size: 1.4em;
  font-weight: 500;
  margin-bottom: 0;
}
</style>
