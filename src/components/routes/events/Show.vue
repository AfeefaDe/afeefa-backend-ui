<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="event" :routeConfig="routeConfig" slot="headerButtons" v-if="event" />

    <div v-if="event">
      <image-container :image-url="event.media_url" />

        <!-- EVENT -->

        <entry-detail-split-view>
          <div slot="left">
            <entry-detail-area>
              <entry-detail-section :title="$tc('entries.date')" icon="date_range" :editLink="{name: 'events.edit', params: {id: event.id}}">
                {{ event | formatEventDate }}
                <span>({{event.date_start | formatDateRelative(($i18n.locale))}})</span>
              </entry-detail-section>

              <entry-detail-section title="Veranstalter" icon="group" :dispatchEdit="true">
                <actor-selector :actor="event" relationName="hosts" title="Veranstalter" />
              </entry-detail-section>

              <entry-description :entry="event" />

              <entry-detail-section title="Kategorien" icon="local_offer">
                <entry-detail-property title="Navigation">
                  <editable-entry-navigation-items :entry="event" :isEdit="true" :customTrigger="true" :hideAddLink="true"  />
                </entry-detail-property>

                <div v-for="facet in facets" :key="facet.id">
                  <entry-detail-property :title="facet.title">
                    <editable-entry-facet-items :entry="event" :facets="[facet]" :bus="bus" :hideAddLink="true" />
                  </entry-detail-property>
                </div>
              </entry-detail-section>
            </entry-detail-area>

            <entry-detail-area>
              <contact-list :item="event" />
            </entry-detail-area>
          </div>

          <!-- STATUS & ANNOTATIONS -->

          <div slot="right">
            <div class="meta">
              <entry-detail-section icon="error_outline">
                <entry-detail-footer :entry="event"/>
              </entry-detail-section>
            </div>

            <compact-annotation-list :entry="event" />
          </div>
        </entry-detail-split-view>
    </div>

  </entry-detail>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import EventRouteConfig from './EventRouteConfig'

import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import EntryDescription from '@/components/entry/show/EntryDescription'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ContactList from '@/components/contact/ContactList'
import ImageContainer from '@/components/ImageContainer'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'
import ActorSelector from '@/components/actor/ActorSelector'
import EditableEntryNavigationItems from '@/components/entry/facets/EditableEntryNavigationItems'
import CompactAnnotationList from '@/components/entry/list/compact/CompactAnnotationList'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this, this.id),
      bus: this
    }
  },

  computed: {
    event () {
      return this.item
    }
  },

  components: {
    EntryDetailHeaderButtons,
    EntryDescription,
    EntryDetailFooter,
    ContactList,
    ImageContainer,
    EditableEntryFacetItems,
    ActorSelector,
    EditableEntryNavigationItems,
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
