<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Kategorien</h2>
        </div>

        <div v-if="!facetsLoaded" class="loadingInfo">
          <spinner :show="true" :width="1" :radius="5" :length="3" /> {{ $t('status.load_categories') }}
        </div>

        <div v-else>
          <div v-for="facet in facets" :key="facet.id" class="facet">
            <div>

              <div class="facetAttributes">
                <div class="facetAttributesView">
                  <router-link :to="{name: 'facets.show', params: {id: facet.id}}" class="title">
                    <h4>{{ facet.title }}</h4>
                  </router-link>
                  <a href="" @click.prevent="editFacet(facet)" class="inlineEditLink" v-if="!isEditable(facet)">
                    Ändern
                  </a>
                  <router-link :to="{name: 'facets.show', params: {id: facet.id}}" class="inlineEditLink" v-if="!isEditable(facet)">
                    Verwalten
                  </router-link>
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

              <div class="ownerTypes">
                für: <span v-for="type in facet.owner_types" :key="type" class="ownerType">{{ $t('facets.ownerType' + type) }}</span>
              </div>

              <facet-item-tag-list :facetItems="facet.facet_items" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import FacetItemTagList from '@/components/facet/FacetItemTagList'
import TreeItemEditorForm from '@/components/tree/TreeItemEditorForm'
import Spinner from '@/components/Spinner'

export default {
  data () {
    return {
      facets: [],

      editableFacet: null,
      editableFacetOriginal: null,

      facetsLoaded: false
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

    loadFacets () {
      Facet.Query.getAll().then(facets => {
        this.facets = facets
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
    FacetItemTagList,
    TreeItemEditorForm,
    Spinner
  }
}
</script>

<style lang="scss" scoped>
.loadingInfo {
  margin-top: .8em;
}

.facet {
  border-bottom: 1px solid $gray20;
  padding: 1em 0;
}

.inlineEditLink {
  margin-left: 10px;
}

.facetAttributes {
  margin-bottom: 10px;
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
  margin-bottom: 1em;
}

.facetItemTagList {
  max-width: 800px;
}
</style>
