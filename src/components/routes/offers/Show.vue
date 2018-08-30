<template>
  <entry-detail :component="this">

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

      <div v-for="(facet, index) in facets" :key="facet.id">
        <entry-detail-property
          :name="facet.title"
          :iconName="index ? '' : 'bookmark_border'">
          <editable-entry-facets :entry="item" :facets="[facet]" :bus="bus" />
        </entry-detail-property>
      </div>

      <entry-detail-property
        name="Navigation"
        iconName="bookmark_border">
        <entry-navigation-items :entry="item" :isEdit="true" />
      </entry-detail-property>

      <entry-detail-property
        v-if="offer.description"
        :name="$t('entries.description')"
        iconName="more_horiz"
        :isMultiline="true">
        <span>{{ offer.description }}</span>
      </entry-detail-property>
    </div>

  </entry-detail>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import OfferRouteConfig from './OfferRouteConfig'

import EntryFacetItems from '@/components/entry/EntryFacetItems'
import OfferOwners from '@/components/entry/show/relations/OfferOwners'
import EditableEntryFacets from '@/components/entry/EditableEntryFacets'
import EntryNavigationItems from '@/components/entry/EntryNavigationItems'

export default {
  mixins: [EntryShowMixin],

  props: ['id'],

  data () {
    return {
      routeConfig: new OfferRouteConfig(this, this.id),
      bus: this
    }
  },

  computed: {
    offer () {
      return this.item
    }
  },

  components: {
    EntryFacetItems,
    OfferOwners,
    EditableEntryFacets,
    EntryNavigationItems
  }
}
</script>
