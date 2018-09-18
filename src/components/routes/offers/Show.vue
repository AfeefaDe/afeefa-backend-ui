<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="offer" :routeConfig="routeConfig" slot="headerButtons" v-if="offer" />

    <div v-if="offer">
      <image-container :image-url="offer.image_url" />

      <entry-detail-split-view>
        <div slot="left">
          <entry-detail-area>
            <entry-detail-section title="Träger" icon="group" :dispatchEdit="true">
              <actor-selector :actor="offer" relationName="owners" title="Träger" />
            </entry-detail-section>

            <entry-description :entry="offer" />

            <entry-detail-section title="Kategorien" icon="local_offer">
              <div v-for="facet in facets" :key="facet.id">
                <entry-detail-property :title="facet.title">
                  <editable-entry-facet-items :entry="offer" :facets="[facet]" :bus="bus" :hideAddLink="true" />
                </entry-detail-property>
              </div>

              <entry-detail-property title="Navigation">
                <editable-entry-navigation-items :entry="offer" :isEdit="true" :customTrigger="true" :hideAddLink="true"  />
              </entry-detail-property>
            </entry-detail-section>
          </entry-detail-area>

          <entry-detail-area>
            <contact-list :item="offer" />
          </entry-detail-area>
        </div>

        <div slot="right">
          <div class="meta">
            <entry-detail-section icon="error_outline">
              <entry-detail-footer :entry="offer"/>
            </entry-detail-section>
          </div>

          <compact-annotation-list :entry="offer" />
        </div>

      </entry-detail-split-view>
    </div>

  </entry-detail>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import OfferRouteConfig from './OfferRouteConfig'

import EntryFacetItems from '@/components/entry/facets/EntryFacetItems'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'
import EditableEntryNavigationItems from '@/components/entry/facets/EditableEntryNavigationItems'
import ContactList from '@/components/contact/ContactList'
import EntryDescription from '@/components/entry/show/EntryDescription'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ImageContainer from '@/components/ImageContainer'
import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import ActorSelector from '@/components/actor/ActorSelector'
import CompactAnnotationList from '@/components/entry/list/compact/CompactAnnotationList'

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
    },

    tabNames () {
      let tabNames = ['overview']
      tabNames.push({name: 'todos', hint: this.offer.annotations.length})
      return tabNames
    }
  },

  components: {
    EntryFacetItems,
    EditableEntryFacetItems,
    EditableEntryNavigationItems,
    ContactList,
    EntryDescription,
    EntryDetailFooter,
    ImageContainer,
    EntryDetailHeaderButtons,
    ActorSelector,
    CompactAnnotationList
  }
}
</script>

<style lang="scss" scoped>
.meta {
  background-color: $whiter;
  border: 1px solid $gray10;
  box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.05);
  padding: 1em 1.5em;
  font-size: .9em;
}

.entryDetailSplitView {
  margin-bottom: 3em;
}

.entryDetailSection:not(:first-child) {
  margin-top: 3em;
}

.entryDetailProperty {
  margin-top: 1.5em;
}

.editableEntryFacetItems {
  margin-top: .5em;
}

.entryNavigationItems {
  margin-top: .5em;
}
</style>
