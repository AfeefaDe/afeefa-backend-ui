<template>
  <entry-detail2 :component="this">

    <div v-if="offer">
      <entry-detail-property name="Träger" :iconName="'device_hub'">
        <offer-owners :owner="offer" relationName="owners" title="Träger">
          <div slot="actor" slot-scope="props">
            <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
              {{ props.actor.title }}
            </router-link>
          </div>
        </offer-owners>
      </entry-detail-property>

      <entry-detail-property
        name="Kategorien"
        iconName="bookmark_border">
        <entry-facet-items :entry="offer" :isEdit="true" />
      </entry-detail-property>

      <entry-detail-property
        v-if="offer.description"
        :name="$t('entries.description')"
        iconName="more_horiz"
        :isMultiline="true">
        <span>{{ offer.description }}</span>
      </entry-detail-property>
    </div>

  </entry-detail2>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import OfferRouteConfig from './OfferRouteConfig'

import EntryDetailProperty from '@/components/entry/show/EntryDetailProperty'
import EntryFacetItems from '@/components/entry/EntryFacetItems'
import OfferOwners from '@/components/entry/show/relations/OfferOwners'

export default {
  mixins: [EntryShowMixin],

  props: ['id'],

  data () {
    return {
      routeConfig: new OfferRouteConfig(this, this.id)
    }
  },

  computed: {
    offer () {
      return this.item
    }
  },

  components: {
    EntryDetailProperty,
    EntryFacetItems,
    OfferOwners
  }
}
</script>
