<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard" v-if="offer">

        <div class="mainCard__header">
          <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>

          <div class="mainCard__headerTitle">
            <span class="mainCard__type">{{ $tc('offers.offer') }}</span>
            <h2 class="mainCard__headerTitleHeading">{{ offer.title }}</h2>
            <span class="mainCard__headerSubtitle">
              <router-link :to="{name: 'orgas.show', params: {id: actor.id}}" v-for="actor in offer.actors" :key="actor.id">
                <u>{{ actor.title }}</u>
              </router-link>
            </span>
          </div>

          <div class="mainCard__headerButtonContainer">
            <router-link :to="{name: 'offers.edit', params: {id: offer.id}}" class="mainCard__headerButton">
              {{$t('buttons.edit')}}
              <i class="material-icons">mode_edit</i>
            </router-link>
          </div>
        </div>

        <div>
          <entry-detail-property
            name="Kategorien"
            iconName="bookmark_border">
            <entry-facet-items :entry="offer" :isEdit="true" />
          </entry-detail-property>

          <entry-detail-property
            v-if="offer.title"
            :name="$t('entries.title')"
            iconName="more_horiz">
            <span>{{ offer.title }}</span>
          </entry-detail-property>

          <entry-detail-property
            v-if="offer.description"
            :name="$t('entries.short_description')"
            iconName="more_horiz"
            :isMultiline="true">
            <span>{{ offer.description }}</span>
          </entry-detail-property>
        </div>
      </div>

      <entry-loading-message v-else :error="hasItemLoadingError" :messages="loadingMessages" />
    </div>
  </div>
</template>


<script>
import Offer from '@/models/Offer'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryDetailProperty from '@/components/entry/show/EntryDetailProperty'
import EntryFacetItems from '@/components/entry/EntryFacetItems'

export default {
  props: ['id'],

  data () {
    return {
      offer: null,
      hasItemLoadingError: false,
      loadingMessages: {
        loadingItem: () => this.$t('status.load_offer') + ' ' + this.id,
        loadingItemError: () => this.$t('errors.loadingOfferError') + ' ' + this.id
      }
    }
  },

  created () {
    Offer.Query.get(this.id).then(offer => {
      if (offer) {
        this.offer = offer
      } else {
        this.hasItemLoadingError = true
      }
    })
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    }
  },

  components: {
    EntryLoadingMessage,
    EntryDetailProperty,
    EntryFacetItems
  }
}
</script>
