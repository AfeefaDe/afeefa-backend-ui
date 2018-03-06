<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="facet">
      <div v-bind:class="['mainCard__header', 'mainCard__headerCategories']">
        <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>
        <div class="mainCard__headerTitle">
          <h2 class="mainCard__headerTitleHeading">{{ facet.title || 'Kein Titel' }}</h2>
        </div>
        <div class="mainCard__headerButtonContainer">
          <router-link :to="{name: 'facets.edit', params: {id: facet.id}}" class="mainCard__headerButton">
            {{$t('buttons.edit')}}
            <i class="material-icons">mode_edit</i>
          </router-link>
        </div>
      </div>

      <div>
        {{ facet.title }}
      </div>

      <div>
        <div v-for="facetItem in facet.facet_items" :key="facetItem.id">
          <h4 :style="{color: facetItem.color}">{{ facetItem.title }}</h4>
          <a href="" @click.prevent="removeFacetItem(facetItem)">Löschen</a>
        </div>
      </div>

      <div>
        <input type="text" v-model="newFacetItem.title" @keyup.enter="addFacetItem">
        <button class="btn waves-effect waves-light saveButton" type="submit" @click="addFacetItem">
          <i class="material-icons left">done</i>
          Hinzufügen
        </button>
      </div>

    </div>
  </div>
</div>
</template>


<script>
import Facet from '@/models/Facet'
import FacetItem from '@/models/FacetItem'

export default {
  props: ['id'],

  data () {
    return {
      facet: null,
      newFacetItem: new FacetItem()
    }
  },

  created () {
    this.loadFacet()
  },

  methods: {
    loadFacet () {
      Facet.get(this.id).then(facet => {
        this.facet = facet
      })
    },

    goBack () {
      this.$router.go(-1)
    },

    addFacetItem () {
      this.facet.$rels.facet_items.Query.save(this.newFacetItem).then(facetItem => {
        if (facetItem) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Das Facettenitem wurde hinzugefügt'
          })
          this.loadFacet()
        }
      })
      this.newFacetItem = new FacetItem()
    },

    removeFacetItem (facetItem) {
      this.$store.dispatch('messages/showDialog', {
        title: 'Facette löschen',
        message: 'Soll das Facettenitem gelöscht werden?\n\nAlle Akteure verlieren dieses Item.'
      }).then(result => {
        if (result === 'yes') {
          this.facet.$rels.facet_items.Query.delete(facetItem).then(deleted => {
            if (deleted) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Das Facettenitem wurde gelöscht'
              })
              this.loadFacet()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
