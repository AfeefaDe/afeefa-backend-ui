<template>
  <afeefa-page>
    <afeefa-header slot="header">
      <div slot="title">
        Kategorien
      </div>
    </afeefa-header>

    <div slot="content">
      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames" v-if="facets.length">
        <div class="treeViewContent" slot="default">
          <div class="treeNavigation" v-if="false">
            <div v-for="facet in facets" :key="facet.id" @click="selectFacet(facet)">
              <facet-selector-item
                :item="facet"
                :color="facet.color"
                :more="false"
                :selected="facet === selectedFacet"
                />
              <div class="ownerTypes" v-if="false">
                für: <span v-for="type in facet.owner_types" :key="type" class="ownerType">{{ $t('facets.ownerType' + type) }}</span>
              </div>
            </div>
          </div>

          <editable-tree-view
            v-if="selectedFacet"
            :containerId="selectedFacet.id"
            :routeConfig="treeConfig">

            <div class="facetAttributes" slot="content">
              <div class="facetAttributesView">
                <h4>{{ selectedFacet.title }}</h4>
                <a href="" @click.prevent="editFacet(selectedFacet)" class="inlineEditLink" v-if="!isEditable(selectedFacet)">
                  Ändern
                </a>
                <a href="" @click.prevent="cancelEditFacet()" class="inlineEditLink" v-if="isEditable(selectedFacet)">
                  Abbrechen
                </a>
              </div>

              <div class="ownerTypes">
                für: <span v-for="type in selectedFacet.owner_types" :key="type" class="ownerType">{{ $t('facets.ownerType' + type) }}</span>
              </div>

              <div v-if="isEditable(selectedFacet)">
                <tree-item-editor-form
                  :item="editableFacet"
                  :hasAttributes="true"
                  :hasColor="true"
                  @update="updateFacet"
                  @cancel="cancelEditFacet" />
              </div>
            </div>

          </editable-tree-view>
        </div>
      </tab-bar>

    </div>

  </afeefa-page>
</template>


<script>
import Facet from '@/models/Facet'
import FacetTreeConfig from './FacetTreeConfig'
import EditableTreeView from '@/components/tree/EditableTreeView'
import TreeItemEditorForm from '@/components/tree/TreeItemEditorForm'

export default {
  data () {
    return {
      selectedFacet: null,
      facets: [],
      treeConfig: new FacetTreeConfig(this, this.id),
      editableFacet: null,
      editableFacetOriginal: null
    }
  },

  created () {
    this.loadFacets()
  },

  watch: {
    'editableFacet.color' (color) {
      if (this.editableFacetOriginal) {
        this.editableFacetOriginal.previewColor = color || null
      }
    }
  },

  computed: {
    tabNames () {
      return this.facets.map(facet => {
        return {
          name: facet.title,
          hint: facet.getAllFacetItems().length,
          color: facet.previewColor || facet.color
        }
      })
    }
  },

  methods: {
    setCurrentTab (tabName) {
      this.selectedFacet = this.facets.find(facet => facet.title === tabName)
    },

    selectFacet (facet) {
      this.selectedFacet = facet
    },

    editFacet (facet) {
      this.editableFacetOriginal = facet
      this.editableFacet = facet.clone()
    },

    cancelEditFacet () {
      this.editableFacetOriginal.previewColor = null
      this.editableFacetOriginal = null

      this.editableFacet = null
    },

    isEditable (facet) {
      return this.editableFacet && this.editableFacet.id === facet.id
    },

    loadFacets () {
      Facet.Query.getAll().then(facets => {
        this.facets = facets

        this.selectedFacet = this.facets[0]
        this.facetsLoaded = true
      })
    },

    updateFacet (facet) {
      Facet.Query.save(facet).then(facet => {
        if (facet) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Kategorie wurde geändert.'
          })
        }
        this.cancelEditFacet()
      })
    }
  },

  components: {
    EditableTreeView,
    TreeItemEditorForm
  }
}
</script>


<style lang="scss" scoped>
.treeViewContent {
  width: 100%;
  display: flex;
}

.treeNavigation {
  padding-right: 4em;
}

.facetSelectorItem /deep/ .facetItem {
  width: 100%;
  margin-bottom: .5em;
  > * {
    padding-right: 2em;
  }
}

.facetAttributes {
  margin-bottom: 20px;
}

.facetAttributesView {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  a.title {
    color: inherit;
  }

  h4 {
    line-height: 1em;
    font-size: 1.4em;
    font-weight: 500;
    margin: 0;
  }
}

.ownerType:not(:last-child) {
  &:after {
    content: ', ';
  }
}

.ownerTypes {
  font-size: .9em;
  color: $gray50;
}

.inlineEditLink {
  margin-left: 10px;
}
</style>
