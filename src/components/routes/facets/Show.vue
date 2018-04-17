<template>
  <div>
    <editable-tree-view
      :containerId="id"
      :routeConfig="treeConfig">

      <div class="facetAttributes" slot="content" v-if="facet">
        <div class="facetAttributesView">
          <div :style="{'background-color': editableFacet ? editableFacet.color : facet.color}" class="colorIcon"></div>
          <router-link :to="{name: 'facets.show', params: {id: facet.id}}" class="title">
            <h4>{{ facet.title }}</h4>
          </router-link>
          <a href="" @click.prevent="editFacet(facet)" class="inlineEditLink" v-if="!isEditable(facet)">
            Ändern
          </a>
          <a href="" @click.prevent="cancelEditFacet()" class="inlineEditLink" v-if="isEditable(facet)">
            Abbrechen
          </a>
        </div>

        <div v-if="isEditable(facet)">
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
</template>


<script>
import Facet from '@/models/Facet'
import FacetTreeConfig from './FacetTreeConfig'
import EditableTreeView from '@/components/tree/EditableTreeView'
import TreeItemEditorForm from '@/components/tree/TreeItemEditorForm'

export default {
  props: ['id'],

  data () {
    return {
      facet: null,
      treeConfig: new FacetTreeConfig(this, this.id),
      editableFacet: null,
      editableFacetOriginal: null
    }
  },

  created () {
    this.loadFacet()
  },

  watch: {
    'editableFacet.color' (color) {
      if (this.editableFacetOriginal) {
        this.editableFacetOriginal.previewColor = color || null
      }
    }
  },

  methods: {
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

    loadFacet () {
      Facet.Query.get(this.id).then(facet => {
        this.facet = facet
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
.loadingInfo {
  margin-top: .8em;
}

.facet {
  padding: 1em 0;

  &:not(:last-child) {
    border-bottom: 1px solid $gray20;
  }
}

.colorIcon {
  vertical-align: middle;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
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

.inlineEditLink {
  margin-left: 10px;
}

.ownerTypes {
  font-size: .9em;
  color: $gray50;
}

.facetItemTagList {
  max-width: 800px;
}
</style>
