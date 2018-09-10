<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="offer" :routeConfig="routeConfig" slot="headerButtons" v-if="offer" />

    <div v-if="offer">
      <image-container :image-url="offer.image_url" />

      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="overview">
          <div class="splitView">
            <div class="entryDetail splitView__splitViewChild">
              <entry-detail-section title="Träger" icon="group" :dispatchEdit="true">
                <actor-selector :actor="offer" relationName="owners" title="Träger" />
              </entry-detail-section>

              <entry-detail-section
                :title="$t('entries.description')"
                icon="format_align_left"
                :editLink="{name: 'offers.edit', params: {id: offer.id}}">

                <div v-if="offer.short_description">{{ offer.short_description }}</div>
              </entry-detail-section>

              <entry-detail-section title="Kategorien" icon="label">
                <div v-for="facet in facets" :key="facet.id">
                  <entry-detail-property2 :title="facet.title">
                    <editable-entry-facet-items :entry="offer" :facets="[facet]" :bus="bus" :hideAddLink="true" />
                  </entry-detail-property2>
                </div>

                <entry-detail-property2 title="Navigation">
                  <editable-entry-navigation-items :entry="offer" :isEdit="true" :customTrigger="true" :hideAddLink="true"  />
                </entry-detail-property2>
              </entry-detail-section>
            </div>

            <contact-list :item="offer" class="splitView__splitViewChild"/>
          </div>

          <entry-detail-footer :entry="offer"/>
        </section>

        <section slot="todos">
          <annotation-view :entry="offer" />
        </section>

      </tab-bar>
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
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ImageContainer from '@/components/ImageContainer'
import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import AnnotationView from '@/components/annotation/AnnotationView'
import ActorSelector from '@/components/actor/ActorSelector'

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
    EntryDetailFooter,
    ImageContainer,
    EntryDetailHeaderButtons,
    AnnotationView,
    ActorSelector
  }
}
</script>

<style lang="scss" scoped>
.splitView {
  padding-top: 1em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > * {
    width: 100%;
  }
  &__splitViewChild {
    width: 50%;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
    &:first-child {
      padding-right: 2em;
    }
    &:last-child {
      padding-left: 2em;
    }
  }
}

.entryDetailSection:not(:first-child) {
  margin-top: 5em;
}

.entryDetailProperty {
  margin-top: 1em;
}

.editableEntryFacetItems {
  margin-top: .5em;
}

.entryNavigationItems {
  margin-top: .5em;
}
</style>
