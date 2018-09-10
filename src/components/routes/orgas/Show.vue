<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="orga" :routeConfig="routeConfig" slot="headerButtons" v-if="orga" />

    <div slot="secondaryHeaderButtons" class="secondaryHeaderButtons" v-if="orga">
      <router-link :to="{name: 'offers.new', query: {actorId: orga.id}}" class="btn gray btn-small">
        <i class="material-icons left">add</i>
        Angebot
      </router-link>

      <router-link :to="{name: 'events.new', query: {actorId: orga.id}}" class="btn gray btn-small">
        <i class="material-icons left">add</i>
        Veranstaltung
      </router-link>
    </div>

    <div v-if="orga">
      <image-container :image-url="orga.media_url" />

      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="overview">
          <div class="actionButtons" v-if="false">
            <editable-actor-actors :owner="orga" relationName="projects" title="Projekt hinzufügen" slot="triggerButton">
              <span class="btn btn-small gray">
                <i class="material-icons left">add</i>
                Projekt
              </span>
            </editable-actor-actors>

            <editable-actor-actors :owner="orga" relationName="network_members" title="Netzwerkmitglied hinzufügen" slot="triggerButton">
              <span class="btn btn-small gray">
                <i class="material-icons left">add</i>
                Netzwerkmitglied
              </span>
            </editable-actor-actors>
          </div>

          <div class="overview splitView">
            <div class="entryDetail splitView__splitViewChild">
              <entry-detail-section title="Projektträger" icon="group" :dispatchEdit="true">
                <actor-selector :actor="orga" relationName="project_initiators" title="Projektträger" />
              </entry-detail-section>

              <entry-detail-section
                :title="$t('entries.description')"
                icon="format_align_left"
                :editLink="{name: 'orgas.edit', params: {id: orga.id}}">

                <div v-if="orga.short_description">{{ orga.short_description }}</div>
              </entry-detail-section>

              <entry-detail-section v-if="false"
                title="Test"
                icon="format_align_left"
                :inlineEditing="true">
                <div slot-scope="props">
                  {{ props }}
                </div>
              </entry-detail-section>

              <entry-detail-section title="Kategorien" icon="label">
                <div v-for="facet in facets" :key="facet.id">
                  <entry-detail-property2 :title="facet.title">
                    <editable-entry-facet-items :entry="item" :facets="[facet]" :bus="bus" :hideAddLink="true" />
                  </entry-detail-property2>
                </div>

                <entry-detail-property2 title="Navigation">
                  <editable-entry-navigation-items :entry="orga" :isEdit="true" :customTrigger="true" :hideAddLink="true"  />
                </entry-detail-property2>
              </entry-detail-section>

              <entry-detail-section title="Netzwerke" icon="group" :dispatchEdit="true" v-if="false">
                <actor-selector :actor="orga" relationName="networks" title="Netzwerke" />
              </entry-detail-section>

              <entry-detail-section title="Partner" icon="group" :dispatchEdit="true" v-if="false">
                <actor-selector :actor="orga" relationName="partners" title="Partner" />
              </entry-detail-section>

              <entry-detail-section
                title="Attribute"
                icon="settings"
                :editLink="{name: 'orgas.edit', params: {id: orga.id}}">

                <entry-detail-property2 :title="$t('entries.certified_sfr')">
                    {{orga.certified_sfr ? $t('entries.certified_sfr_yes') : $t('entries.certified_sfr_no')}}
                </entry-detail-property2>

                <entry-detail-property2 :title="$t('entries.support_wanted')">
                  <span v-if="orga.support_wanted_detail">
                    {{orga.support_wanted_detail}}
                  </span>
                  <span v-else>
                    {{orga.support_wanted ? $t('entries.support_wanted_yes') : $t('entries.support_wanted_no')}}
                  </span>
                </entry-detail-property2>

                <entry-detail-property2 title="Facebook ID für Events">
                  {{ orga.facebook_id || 'Keine ID angegeben'}}
                </entry-detail-property2>
              </entry-detail-section>
            </div>

            <div class="splitView__splitViewChild">
              <router-link :to="{name: 'offers.convert', query: {actorId: orga.id}}" class="btn green btn-small">
                <i class="material-icons left">add</i>
                In Angebot umwandeln
              </router-link>

              <contact-list :item="orga" />
            </div>
          </div>

          <entry-detail-footer :entry="orga"/>

        </section>

        <section slot="todos">
          <annotation-view :entry="orga" />
        </section>

        <section slot="resources" v-if="orga.resource_items.length">
          <resource-item v-for="resourceItem in orga.resource_items" :key="resourceItem.id" :resourceItem="resourceItem"
          :editEnabled="false"></resource-item>
        </section>

        <section slot="networkMembers">
          <actor-selector :actor="orga" relationName="network_members" title="Mitglieder" />

          <entry-list-items
            :items="orga.network_members"
            v-if="orga.network_members.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Mitglieder zugeordnet
          </div>

          <actor-selector :actor="orga" relationName="network_members" title="Mitglieder" />
        </section>

        <section slot="offers">
          <entry-list-items
            :items="orga.offers"
            v-if="orga.offers.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Angebote zugeordnet
          </div>
        </section>

        <section slot="projects">
          <entry-list-items
            :items="orga.projects"
            v-if="orga.projects.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Projekte zugeordnet
          </div>
        </section>

        <section slot="events">

          <tab-bar @setCurrentTab="setCurrentSubTab" :tabNames="eventTabNames" :isSubBar="true" v-if="orga.count_events">
            <div slot="upcomingEvents">
              <entry-list-items
                :items="orga.upcoming_events"
                v-if="orga.upcoming_events.length"
                :customSortOrders="[{ sort: sortByDateMixin, order: 'ASC' }]"
                :options="{pagination: true, event_date: true}">
              </entry-list-items>
            </div>
            <div slot="pastEvents">
              <entry-list-items
                :items="orga.past_events"
                v-if="orga.past_events.length"
                :customSortOrders="[{ sort: sortByDateStart, order: 'DESC' }]"
                :options="{pagination: true, event_date: true}">
              </entry-list-items>
            </div>
          </tab-bar>

          <div v-else>
            Keine Veranstaltungen hinzugegfügt.
          </div>

        </section>
      </tab-bar>
    </div>

  </entry-detail>

</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import OrgaRouteConfig from './OrgaRouteConfig'

import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByDateMixin from '@/helpers/sort-by-date-mixin'
import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import ImageContainer from '@/components/ImageContainer'
import EditableEntryNavigationItems from '@/components/entry/facets/EditableEntryNavigationItems'
import ContactList from '@/components/contact/ContactList'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ActorSelector from '@/components/actor/ActorSelector'
import EntryListItems from '@/components/entry/list/EntryListItems'
import AnnotationView from '@/components/annotation/AnnotationView'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'
import entryListFilters from '@/helpers/entry-list-filters'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this, this.id),
      sortByDateStart,
      sortByDateMixin,
      bus: this
    }
  },

  computed: {
    orga () {
      return this.item
    },

    eventTabNames () {
      return [
        { name: 'upcomingEvents', hint: this.orga.upcoming_events.length },
        { name: 'pastEvents', hint: this.orga.past_events.length }
      ]
    },

    tabNames () {
      let tabNames = ['overview']
      // if (this.orga.offers.length) {
      //   }
      // if (this.orga.upcoming_events.length + this.orga.past_events.length) {
      //   }
      // if (this.orga.projects.length) {
      //   }
      // if (this.orga.network_members.length) {
      //   }
      tabNames.push({name: 'todos', hint: this.orga.annotations.length})
      tabNames.push({name: 'offers', hint: this.orga.offers.length})
      tabNames.push({name: 'events', hint: this.orga.upcoming_events.length + this.orga.past_events.length})
      tabNames.push({name: 'projects', hint: this.orga.projects.length})
      // tabNames.push({name: 'networkMembers', hint: this.orga.network_members.length})
      if (this.currentUser.area === 'dresden') {
        // tabNames.push({name: 'resources', hint: this.orga.resource_items.length})
      }
      return tabNames
    }
  },

  methods: {
    actorRelationSaved (relationName) {
      this.orga.$rels[relationName].refetch()
    },

    hasFacetItemForFacet (facet) {
      return entryListFilters.entryHasFacetItemForFacet(this.orga, facet)
    }
  },

  components: {
    EntryDetailHeaderButtons,
    ImageContainer,
    EditableEntryNavigationItems,
    ActorSelector,
    ContactList,
    EntryDetailFooter,
    EntryListItems,
    AnnotationView,
    EditableEntryFacetItems
  }
}
</script>


<style lang="scss" scoped>
.secondaryHeaderButtons {
  display: flex;
}

.actionButtons {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  line-height: 0;

  > * {
    margin-right: .5em;
  }
}

.splitView {
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

  &.overview {
    padding-top: 1em;
    // position: relative;
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
