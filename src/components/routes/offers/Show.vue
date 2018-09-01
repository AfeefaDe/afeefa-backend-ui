<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="offer" :routeConfig="routeConfig" slot="headerButtons" v-if="offer" />

    <image-container v-if="offer"
      :image-url="offer.image_url">
    </image-container>

    <div v-if="offer" class="splitView">
      <div class="entryDetail splitView__splitViewChild">
        <entry-detail-property name="Träger" iconName="group">
          <editable-offer-owners :owner="offer" relationName="owners" title="Träger" :showActors="true">
            <div slot="actor" slot-scope="props">
              <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                {{ props.actor.title }}
              </router-link>
            </div>
          </editable-offer-owners>
        </entry-detail-property>

        <entry-detail-property
          v-if="offer.description"
          :name="$t('entries.description')"
          iconName="format_align_left"
          :isMultiline="true">
          <span>{{ offer.description }}</span>
        </entry-detail-property>

        <div v-for="(facet, index) in facets" :key="facet.id">
          <entry-detail-property
            :name="facet.title"
            :iconName="index ? '' : 'bookmark_border'">
            <editable-entry-facet-items :entry="item" :facets="[facet]" :bus="bus" />
          </entry-detail-property>
        </div>

        <entry-detail-property
          name="Navigation">
          <editable-entry-navigation-items :entry="offer" :isEdit="true" />
        </entry-detail-property>

        <entry-detail-property
          :name="$tc('headlines.annotations', offer.annotations.length)"
          :iconName="'label_outline'"
          v-if="offer.annotations.length">
          <div>
            <annotation-tag v-for="annotation in offer.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>
          </div>
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

import EntryFacetItems from '@/components/entry/facets/EntryFacetItems'
import EditableOfferOwners from '@/components/actor/EditableOfferOwners'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'
import EditableEntryNavigationItems from '@/components/entry/facets/EditableEntryNavigationItems'
import ContactList from '@/components/contact/ContactList'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ImageContainer from '@/components/ImageContainer'
import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import AnnotationTag from '@/components/AnnotationTag'

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
    EditableOfferOwners,
    EditableEntryFacetItems,
    EditableEntryNavigationItems,
    ContactList,
    EntryDetailFooter,
    ImageContainer,
    EntryDetailHeaderButtons,
    AnnotationTag
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
