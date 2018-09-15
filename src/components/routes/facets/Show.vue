<template>
  <afeefa-page>
    <afeefa-header slot="header">
      <div slot="title">
        Kategorien
      </div>
    </afeefa-header>

    <div slot="content">
      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames" v-if="facets.length">
        <div slot="default">
          <editable-tree-view
            v-if="selectedFacet"
            :containerId="selectedFacet.id"
            :routeConfig="treeConfig">

            <div class="facetAttributes" slot="content">
              <div class="facetAttributesView">
                <h4>{{ selectedFacet.title }}</h4>
                <a href="" @click.prevent="editFacet()" class="inlineEditLink" v-if="!isEditable()">
                  Ändern
                </a>
              </div>

              <div class="ownerTypes">
                für: <span v-for="type in selectedFacet.owner_types" :key="type" class="ownerType">{{ $t('facets.ownerType' + type) }}</span>
              </div>

              <div v-if="isEditable()">
                <tree-item-editor
                  :item="selectedFacet"
                  :routeConfig="{canColorizeItems: true}"
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
import TreeItemEditor from '@/components/tree/TreeItemEditor'

export default {
  data () {
    return {
      selectedFacet: null,
      facets: [],
      treeConfig: new FacetTreeConfig(this, this.id),
      editableFacet: null
    }
  },

  created () {
    this.loadFacets()
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

    editFacet () {
      this.editableFacet = this.selectedFacet
    },

    cancelEditFacet () {
      this.editableFacet = null
    },

    isEditable () {
      return this.editableFacet === this.selectedFacet
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
    TreeItemEditor
  }
}
</script>


<style lang="scss" scoped>
.facetItemTag /deep/ .facetItem {
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
