<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="event" :routeConfig="routeConfig" slot="headerButtons" v-if="event" />

    <div v-if="event">
      <image-container :image-url="event.media_url" />

      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="overview">
          <div class="splitView">
            <div class="entryDetail splitView__splitViewChild">

              <entry-detail-section :title="$tc('entries.date')" icon="date_range" :editLink="{name: 'events.edit', params: {id: event.id}}">
                {{ event | formatEventDate }}
                <span>({{event.date_start | formatDateRelative}})</span>
              </entry-detail-section>

              <entry-detail-section title="Veranstalter" icon="group" :dispatchEdit="true">
                <actor-selector :actor="event" relationName="hosts" title="Veranstalter" />
              </entry-detail-section>

              <entry-description :entry="event" />

              <entry-detail-section title="Kategorien" icon="label">
                <div v-for="facet in facets" :key="facet.id">
                  <entry-detail-property2 :title="facet.title">
                    <editable-entry-facet-items :entry="event" :facets="[facet]" :bus="bus" :hideAddLink="true" />
                  </entry-detail-property2>
                </div>

                <entry-detail-property2 title="Navigation">
                  <editable-entry-navigation-items :entry="event" :isEdit="true" :customTrigger="true" :hideAddLink="true"  />
                </entry-detail-property2>
              </entry-detail-section>
            </div>

            <contact-list :item="event" class="entryDetail splitView__splitViewChild"/>

          </div>

          <entry-detail-footer :entry="event"/>
        </section>

        <section slot="todos">
          <annotation-view :entry="event" />
        </section>

      </tab-bar>
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
import AnnotationView from '@/components/annotation/AnnotationView'
import ActorSelector from '@/components/actor/ActorSelector'
import EditableEntryNavigationItems from '@/components/entry/facets/EditableEntryNavigationItems'

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
    },

    tabNames () {
      let tabNames = ['overview']
      tabNames.push({name: 'todos', hint: this.event.annotations.length})
      return tabNames
    }
  },

  components: {
    EntryDetailHeaderButtons,
    EntryDescription,
    EntryDetailFooter,
    ContactList,
    ImageContainer,
    EditableEntryFacetItems,
    AnnotationView,
    ActorSelector,
    EditableEntryNavigationItems
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
