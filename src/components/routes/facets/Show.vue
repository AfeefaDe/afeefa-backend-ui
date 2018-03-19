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
            <h4>{{ facet.title }}</h4>
            <a href="" @click.prevent="editFacet()" class="editLink" v-if="!isEditable">
              Ändern
            </a>
            <a href="" @click.prevent="removeFacet()" class="editLink" v-if="!isEditable">
              Löschen
            </a>
            <a href="" @click.prevent="cancelEditFacet()" class="editLink" v-if="isEditable">
              Abbrechen
            </a>
          </div>

          <div v-if="isEditable" class="facetEditor editor">
            <div class="editorForm">
              <input class="browser-default" type="text" placeholder="Titel"
                v-focus v-select
                v-model="editableFacet.title"
                @keyup.enter="updateFacet()"
                @keyup.esc="cancelEditFacet()">
              <button type="button" class="btn btn-small waves-effect waves-light deleteButton" @click="updateFacet()">
                <i class="material-icons left">done</i>
              </button>
            </div>
          </div>
        </div>

        <div v-for="facetItem in this.facetItems" :key="facetItem.id" class="facetItem mainFacetItem">
          <facet-item-view
            :facetItem="facetItem"
            :bus="bus"
            :isSub="false"
            @update="loadFacetItems"
            @remove="loadFacetItems" />

          <div v-for="subFacetItem in facetItem.sub_items" :key="subFacetItem.id" class="facetItem subFacetItem">
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
import FacetItemTag from '@/components/facet/FacetItemTag'
import FacetItemEditor from '@/components/facet/FacetItemEditor'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  props: ['id'],

  data () {
    return {
      facet: null,
      facetItems: [],
      editableFacet: null,
      newFacetItem: new FacetItem(),
      isEditable: false,
      bus: new Vue()
    }
  },

  created () {
    this.loadFacet()
  },

  methods: {
    createNewFacetItem (parentItem) {
      const newFacetItem = new FacetItem()
      newFacetItem.title = 'Neu'
      newFacetItem.facet = this.facet
      if (parentItem) {
        newFacetItem.parent = parentItem
      }
      return newFacetItem
    },

    editFacet () {
      this.editableFacet = this.facet.clone()
      this.isEditable = true
    },

    cancelEditFacet (facet) {
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
      console.log('load facet items')
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
    FacetItemTag,
    FacetItemEditor,
    ColorPicker: Swatches
  }
}
</script>

<style lang="scss" scoped>
.facetInfo {
  display: flex;
  align-items: center;

  h4 {
    font-size: 2em;
    line-height: 0;
  }
}

.facetEditor {
  margin-bottom: 20px;
}

.editor {
  .editorForm {
    display: inline-flex;
    align-items: center;
    margin-top: .2em;
    background-color: #EEEEEE;
    padding: .3em;
  }

  .editorForm > * {
    line-height: 1em;
    margin-right: .4em !important;
  }
}

.editLink {
  margin-top: 8px;
  margin-left: 10px;
  color: $gray30;
  font-size: .8em;
  text-decoration: underline;

  &:hover {
    color: $secondaryBlue;
  }
}
</style>
