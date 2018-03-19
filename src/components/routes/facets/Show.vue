<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="facet">
      <div class="mainCard__header">
        <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>
        <h2 class="mainCard__headerTitle">{{ facet.title || 'Kein Titel' }}</h2>
      </div>

      <div>
        <div class="facet">
          <div class="facetInfo">
            <div class="facetColorIcon" :style="facetColor ? {'background-color': facetColor} : ''"></div>
            <h4>{{ facet.title }}</h4>
            <a href="" @click.prevent="editFacet()" class="inlineEditLink" v-if="!isEditable">
              Ändern
            </a>
            <a href="" @click.prevent="removeFacet()" class="inlineEditLink" v-if="!isEditable">
              Löschen
            </a>
            <a href="" @click.prevent="cancelEditFacet()" class="inlineEditLink" v-if="isEditable">
              Abbrechen
            </a>
          </div>

          <div v-if="isEditable">
            <facet-item-editor-form
              :item="editableFacet"
              :hasAttributes="true"
              :hasColor="true"
              @update="updateFacet"
              @cancel="cancelEditFacet" />
          </div>
        </div>

        <div v-for="facetItem in this.facetItems" :key="facetItem.id">
          <facet-item-view
            :facetItem="facetItem"
            :bus="bus"
            :isSub="false"
            @update="loadFacetItems"
            @remove="loadFacetItems" />

          <div v-for="subFacetItem in facetItem.sub_items" :key="subFacetItem.id">
            <facet-item-view
              :facetItem="subFacetItem"
              :bus="bus"
              :isSub="true"
              @update="loadFacetItems"
              @remove="loadFacetItems" />
          </div>

          <facet-item-view
            :facetItem="createNewFacetItem(facetItem)"
            :bus="bus"
            :isSub="true"
            @update="loadFacetItems" />
        </div>

        <facet-item-view
          :facetItem="createNewFacetItem()"
          :bus="bus"
          :isSub="false"
          @update="loadFacetItems" />
      </div>
    </div>
  </div>
</div>
</template>


<script>
import Vue from 'vue'
import Facet from '@/models/Facet'
import FacetItem from '@/models/FacetItem'
import FacetItemView from '@/components/facet/FacetItem'
import FacetItemEditorForm from '@/components/facet/FacetItemEditorForm'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  props: ['id'],

  data () {
    return {
      facet: null,
      facetItems: [],
      editableFacet: null,
      isEditable: false,
      bus: new Vue()
    }
  },

  created () {
    this.loadFacet()
  },

  computed: {
    facetColor () {
      let color = null
      if (this.editableFacet) {
        color = this.editableFacet.color
      } else {
        color = this.facet.color
      }
      return color
    }
  },

  watch: {
    'editableFacet.color' (color) {
      this.facet.previewColor = color || null
    }
  },

  methods: {
    createNewFacetItem (parentItem) {
      const newFacetItem = new FacetItem()
      newFacetItem.title = 'Neues Attribut'
      // push facet and parent to new items relations
      // in order to make them cloneable
      newFacetItem.$rels.facet.id = this.facet.id
      if (parentItem) {
        newFacetItem.$rels.parent.id = parentItem.id
      }
      return newFacetItem
    },

    editFacet () {
      this.editableFacet = this.facet.clone()
      this.isEditable = true
    },

    cancelEditFacet (facet) {
      this.facet.previewColor = null
      this.editableFacet = null
      this.isEditable = false
    },

    loadFacet () {
      Facet.Query.get(this.id).then(facet => {
        this.facet = facet
        this.facetItems = facet.facet_items
      })
    },

    loadFacetItems () {
      this.facet.$rels.facet_items.Query.getAll().then(facetItems => {
        this.facetItems = facetItems
      })
    },

    goBack () {
      this.$router.go(-1)
    },

    updateFacet () {
      Facet.Query.save(this.editableFacet).then(facet => {
        if (facet) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde geändert.'
          })
          this.cancelEditFacet()
        }
      })
    },

    removeFacet () {
      this.$store.dispatch('messages/showDialog', {
        title: 'Facette löschen',
        message: 'Soll die Facette gelöscht werden?\n\nAlle Akteure verlieren die Facette.'
      }).then(result => {
        if (result === 'yes') {
          Facet.Query.delete(this.facet).then(deleted => {
            if (deleted) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Die Facette wurde gelöscht'
              })
              this.$router.push({name: 'facets.list'})
            }
          })
        }
      })
    }
  },

  components: {
    FacetItemView,
    FacetItemEditorForm,
    ColorPicker: Swatches
  }
}
</script>

<style lang="scss" scoped>
.facet {
  margin-bottom: 20px;
}

.facetInfo {
  display: flex;
  align-items: center;

  h4 {
    font-size: 2em;
    line-height: 1.4em;
    margin: 0;
  }
}

.facetColorIcon {
  width: 1.3em;
  height: 1.3em;
  margin-right: 8px;
  background-color: $gray30;
}

.inlineEditLink {
  margin-top: 8px;
  margin-left: 10px;
}
</style>
