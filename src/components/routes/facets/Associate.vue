<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="facetItem">
      <div class="mainCard__header">
        <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>

        <div class="mainCard__headerTitle">
          <div class="mainCard__type">{{ $tc('headlines.categories') }}Einträge</div>
          <span v-if="facetItem.parent">
            <router-link :to="{name: 'facetitem.associate', params: {id: facetItem.parent.facet.id, facetItemId: facetItem.parent.id}}">
              <h2 class="mainCard__headerTitle parentItemHeader">{{ facetItem.parent.title }}</h2>
            </router-link>
            <i class="material-icons">chevron_left</i>
          </span>
          <h2 class="mainCard__headerTitle">{{ facetItem.title }}</h2>
        </div>

        <div v-if="currentTab === 'actorsTab'">
          <facet-item-owner-selector title="Akteure hinzufügen" :facetItem="facetItem" type="orgas" @saved="loadOwners">
            <a href="" @click.prevent class="mainCard__headerButton" slot="openButton">
              Akteure hinzufügen
              <i class="material-icons">add</i>
            </a>
          </facet-item-owner-selector>
        </div>

        <div v-if="currentTab === 'offersTab'">
          <facet-item-owner-selector title="Angebote hinzufügen" :facetItem="facetItem" type="offers" @saved="loadOwners">
            <a href="" @click.prevent class="mainCard__headerButton" slot="openButton">
              Angebote hinzufügen
              <i class="material-icons">add</i>
            </a>
          </facet-item-owner-selector>
        </div>

        <div v-if="currentTab === 'eventsTab'">
          <facet-item-owner-selector title="Events hinzufügen" :facetItem="facetItem" type="events" @saved="loadOwners">
            <a href="" @click.prevent class="mainCard__headerButton" slot="openButton">
              Events hinzufügen
              <i class="material-icons">add</i>
            </a>
          </facet-item-owner-selector>
        </div>

      </div>

      <div v-if="isLoading">
        <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Einträge ...
      </div>

      <tab-bar v-else @setCurrentTab="setCurrentTab" :tabNames="tabNames">
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

    <entry-loading-message v-else :error="hasItemLoadingError" :messages="loadingMessages" />
  </div>
</div>
</template>


<script>
import Facet from '@/models/Facet'
import FacetItemOwnerSelector from '@/components/facet/FacetItemOwnerSelector'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryListItems from '@/components/entry/EntryListItems'
import ActorSelector from '@/components/selector/ActorSelector'
import TabBar from '@/components/TabBar'
import sortByTitle from '@/helpers/sort-by-title'
import Spinner from '@/components/Spinner'

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
    ActorSelector,
    TabBar,
    Spinner
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
