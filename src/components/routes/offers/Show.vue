<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="offer" :routeConfig="routeConfig" slot="headerButtons" v-if="offer" />

    <image-container v-if="offer"
      :image-url="offer.image_url">
    </image-container>

    <div v-if="offer" class="splitView">
      <div class="entryDetail splitView__splitViewChild">
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
          <entry-navigation-items :entry="offer" :isEdit="true" />
        </entry-detail-property>

        <entry-detail-property
          v-if="offer.description"
          :name="$t('entries.description')"
          iconName="more_horiz"
          :isMultiline="true">
          <span>{{ offer.description }}</span>
        </entry-detail-property>
      </div>

      <contact-list :item="offer" class="splitView__splitViewChild"/>

      <entry-detail-footer :entry="offer"/>
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
import ContactList from '@/components/contact/ContactList'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ImageContainer from '@/components/ImageContainer'
import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'

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
    EntryNavigationItems,
    ContactList,
    EntryDetailFooter,
    ImageContainer,
    EntryDetailHeaderButtons
  }
}
</script>

<style lang="scss" scoped>
.splitView {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > * {
    width: 100%;
  }
  & > &__splitViewChild {
    width: 50%;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
  }
}
</style>
