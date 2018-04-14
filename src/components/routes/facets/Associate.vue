<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="facetItem">
      <div class="mainCard__header">
        <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>
        <span v-if="facetItem.parent">
          <router-link :to="{name: 'facetitem.associate', params: {id: facetItem.parent.facet.id, facetItemId: facetItem.parent.id}}">
            <h2 class="mainCard__headerTitle parentItemHeader">{{ facetItem.parent.title }}</h2>
          </router-link>
          <i class="material-icons">chevron_left</i>
        </span>
        <h2 class="mainCard__headerTitle">{{ facetItem.title }}</h2>
      </div>

      <div>
        <h4>{{ facetItem.title }}</h4>
        <facet-item-owner-selector :facetItem="facetItem" />

        <entry-list-items
          :items="selectedOwners"
          v-if="selectedOwners.length">
        </entry-list-items>
        <div v-else class="entryDetail__error">
          Keine Einträge zugeordnet
        </div>
      </div>
    </div>

    <entry-loading-message v-else :error="hasItemLoadingError" :messages="loadingMessages" />
  </div>
</div>
</template>


<script>
import Facet from '@/models/Facet'
import FacetItemOwnerSelector from '@/components/facet/FacetItemOwnerSelector'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryListItems from '@/components/entry/EntryListItems'
import ActorSelector from '@/components/entry/edit/actor-relations/ActorSelector'

export default {
  props: ['id', 'facetItemId'],

  data () {
    return {
      facetItem: null,
      selectedOwners: [],
      hasItemLoadingError: false,
      loadingMessages: {
        loadingItem: () => this.$t('status.load_category') + ' ' + this.facetItemId,
        loadingItemError: () => this.$t('errors.loadingCategoryError') + ' ' + this.facetItemId
      }
    }
  },

  created () {
    this.loadFacetItem(this.id, this.facetItemId)
  },

  methods: {
    loadFacetItem (facetId, facetItemId) {
      Facet.Query.get(facetId).then(facet => {
        if (facet) {
          this.facetItem = facet.findFacetItem(facetItemId)
          this.facetItem.$rels.owners.Query.getAll().then(owners => {
            this.selectedOwners = owners
          })
        }
        if (!facet || !this.facetItem) {
          this.hasItemLoadingError = true
        }
      })
    },

    goBack () {
      this.$router.go(-1)
    }
  },

  beforeRouteUpdate (to, from, next) {
    if (this.facetItemId !== to.params.facetItemId) {
      this.loadFacetItem(to.params.id, to.params.facetItemId)
    }
    next()
  },

  components: {
    FacetItemOwnerSelector,
    EntryLoadingMessage,
    EntryListItems,
    ActorSelector
  }
}
</script>

<style lang="scss" scoped>
h4 {
  font-size: 2em;
  line-height: 1.4em;
  margin: 0;
}

.parentItemHeader {
  display: inline-block;
  margin: 0;
  padding: 0;
}
</style>
