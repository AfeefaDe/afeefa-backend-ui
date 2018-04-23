<template>
<afeefa-page>

  <afeefa-header slot="header">
    <div slot="title" v-if="facetItem">
      {{ facetItem.title }}
    </div>

    <div slot="buttons" v-if="facetItem">
      <div v-if="currentTab === 'actorsTab'">
        <facet-item-owner-selector title="Akteure hinzufügen" :facetItem="facetItem" type="orgas" @saved="loadOwners">
          <a href="" @click.prevent class="btn green btn-medium" slot="openButton">
            <i class="material-icons left">add</i>
            Akteure hinzufügen
          </a>
        </facet-item-owner-selector>
      </div>

      <div v-if="currentTab === 'offersTab'">
        <facet-item-owner-selector title="Angebote hinzufügen" :facetItem="facetItem" type="offers" @saved="loadOwners">
          <a href="" @click.prevent class="btn green btn-medium" slot="openButton">
            <i class="material-icons left">add</i>
            Angebote hinzufügen
          </a>
        </facet-item-owner-selector>
      </div>

      <div v-if="currentTab === 'eventsTab'">
        <facet-item-owner-selector title="Events hinzufügen" :facetItem="facetItem" type="events" @saved="loadOwners">
          <a href="" @click.prevent class="btn green btn-medium" slot="openButton">
            <i class="material-icons left">add</i>
            Events hinzufügen
          </a>
        </facet-item-owner-selector>
      </div>
    </div>
  </afeefa-header>

  <div slot="content" v-if="facetItem">
    <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
      <section slot="actorsTab">
        <entry-list-items
          v-if="selectedActors.length"
          :items="selectedActors"
          :options="{filter: true, pagination: true}">
          <div slot="actionButton" slot-scope="props">
            <a href="" class="inlineEditLink medium" @click.prevent="remove(props.item)">
              Entfernen
            </a>
          </div>
        </entry-list-items>
        <div v-else class="entryDetail__error">
          Keine Akteure zugeordnet
        </div>
      </section>

      <section slot="offersTab">
        <entry-list-items
          v-if="selectedOffers.length"
          :items="selectedOffers"
          :options="{filter: true, pagination: true}">
          <div slot="actionButton" slot-scope="props">
            <a href="" class="inlineEditLink medium" @click.prevent="remove(props.item)">
              Entfernen
            </a>
          </div>
        </entry-list-items>
        <div v-else class="entryDetail__error">
          Keine Angebote zugeordnet
        </div>
      </section>

      <section slot="eventsTab">
        <entry-list-items
          v-if="selectedEvents.length"
          :items="selectedEvents"
          :options="{filter: true, pagination: true}">
          <div slot="actionButton" slot-scope="props">
            <a href="" class="inlineEditLink medium" @click.prevent="remove(props.item)">
              Entfernen
            </a>
          </div>
        </entry-list-items>
        <div v-else class="entryDetail__error">
          Keine Events zugeordnet
        </div>
      </section>
    </tab-bar>
  </div>

  <div slot="content" v-else>
    <entry-loading-message :error="hasItemLoadingError" :messages="loadingMessages" />
  </div>


</afeefa-page>
</template>

<script>
import Facet from '@/models/Facet'
import FacetItemOwnerSelector from '@/components/facet/FacetItemOwnerSelector'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryListItems from '@/components/entry/EntryListItems'
import ActorSelector from '@/components/selector/ActorSelector'
import sortByTitle from '@/helpers/sort-by-title'

export default {
  props: ['id', 'facetItemId'],

  data () {
    return {
      facetItem: null,
      owners: [],
      selectedActors: [],
      selectedOffers: [],
      selectedEvents: [],
      isLoading: false,

      currentTab: null,
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

  computed: {
    tabNames () {
      const tabNames = []
      if (this.facetSupportsOwner('Orga')) {
        tabNames.push({name: 'actorsTab', hint: this.selectedActors.length})
      }
      if (this.facetSupportsOwner('Offer')) {
        tabNames.push({name: 'offersTab', hint: this.selectedOffers.length})
      }
      if (this.facetSupportsOwner('Event')) {
        tabNames.push({name: 'eventsTab', hint: this.selectedEvents.length})
      }
      return tabNames
    }
  },

  methods: {
    remove (item) {
      this.$store.dispatch('messages/showDialog', {
        title: 'Kategorie entfernen',
        message: `Soll der Eintrag ${item.title} von der Kategorie ${this.facetItem.title} entfernt werden?`
      }).then(result => {
        if (result === 'yes') {
          this.facetItem.$rels.owners.Query.detach(item).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Der Owner wurde entfernt'
              })
            }
            this.owners = this.owners.filter(o => o !== item)
            this.initOwners()
          })
        }
      })
    },

    facetSupportsOwner (ownerType) {
      return this.facetItem.facet.owner_types.includes(ownerType)
    },

    loadOwners () {
      this.isLoading = true
      this.facetItem.$rels.owners.Query.getAll().then(owners => {
        this.owners = owners
        this.initOwners()
        this.isLoading = false
      })
    },

    initOwners () {
      this.owners = sortByTitle(this.owners)
      this.selectedActors = this.owners.filter(o => o.type === 'orgas')
      this.selectedOffers = this.owners.filter(o => o.type === 'offers')
      this.selectedEvents = this.owners.filter(o => o.type === 'events')
    },

    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab
    },

    loadFacetItem (facetId, facetItemId) {
      this.isLoading = true
      Facet.Query.get(facetId).then(facet => {
        if (facet) {
          this.facetItem = facet.findFacetItem(facetItemId)
          this.loadOwners()
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
.facetItemOwnerSelector {
  margin-bottom: 1em;
}

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
