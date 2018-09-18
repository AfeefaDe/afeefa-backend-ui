<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="orga" :routeConfig="routeConfig" slot="headerButtons" v-if="orga" />

    <div slot="secondaryHeaderButtons" class="secondaryHeaderButtons" v-if="orga">
      <router-link :to="{name: 'offers.convert', query: {actorId: orga.id}}" class="btn btn-small">
        <i class="material-icons left">call_made</i>
        In Angebot umwandeln
      </router-link>
    </div>
    <div v-if="orga">
      <image-container :image-url="orga.media_url" />

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

      <!-- ACTOR -->

      <entry-detail-split-view>
        <div slot="left">
          <entry-detail-area>
            <entry-description :entry="orga" />

            <entry-detail-section title="Kategorien" icon="local_offer">
              <entry-detail-property title="Navigation">
                <editable-entry-navigation-items :entry="orga" :isEdit="true" :customTrigger="true" :hideAddLink="true"  />
              </entry-detail-property>

              <div v-for="facet in facets" :key="facet.id">
                <entry-detail-property :title="facet.title">
                  <editable-entry-facet-items :entry="item" :facets="[facet]" :bus="bus" :hideAddLink="true" />
                </entry-detail-property>
              </div>
            </entry-detail-section>
          </entry-detail-area>

          <entry-detail-area>
            <contact-list :item="orga" />
          </entry-detail-area>

          <entry-detail-area>
            <entry-detail-section title="Projektträger" icon="group" :dispatchEdit="orga.project_initiators.length ? 'Ändern' : 'Hinzufügen'">
              <actor-selector :actor="orga" relationName="project_initiators" title="Projektträger" />
            </entry-detail-section>
          </entry-detail-area>


          <div v-if="false">
            <entry-detail-section title="Netzwerke" icon="group" :dispatchEdit="true" v-if="false">
              <actor-selector :actor="orga" relationName="networks" title="Netzwerke" />
            </entry-detail-section>

            <entry-detail-section title="Partner" icon="group" :dispatchEdit="true">
              <actor-selector :actor="orga" relationName="partners" title="Partner" />
            </entry-detail-section>

            <actor-selector :actor="orga" relationName="network_members" title="Mitglieder" />

            <entry-list-items
              :items="orga.network_members"
              v-if="orga.network_members.length">
            </entry-list-items>
            <div v-else class="entryDetail__error">
              Keine Mitglieder zugeordnet
            </div>

            <actor-selector :actor="orga" relationName="network_members" title="Mitglieder" />

            <entry-list-items
              :items="orga.projects"
              v-if="orga.projects.length">
            </entry-list-items>
            <div v-else class="entryDetail__error">
              Keine Projekte zugeordnet
            </div>
          </div>

          <entry-detail-section
            v-if="false"
            title="Attribute"
            icon="settings"
            :editLink="{name: 'orgas.edit', params: {id: orga.id}}">

            <entry-detail-property :title="$t('entries.certified_sfr')">
                {{orga.certified_sfr ? $t('entries.certified_sfr_yes') : $t('entries.certified_sfr_no')}}
            </entry-detail-property>

            <entry-detail-property :title="$t('entries.support_wanted')">
              <span v-if="orga.support_wanted_detail">
                {{orga.support_wanted_detail}}
              </span>
              <span v-else>
                {{orga.support_wanted ? $t('entries.support_wanted_yes') : $t('entries.support_wanted_no')}}
              </span>
            </entry-detail-property>

            <entry-detail-property title="Facebook ID für Events">
              {{ orga.facebook_id || 'Keine ID angegeben'}}
            </entry-detail-property>
          </entry-detail-section>
        </div>

        <!-- STATUS & ANNOTATIONS -->

        <div slot="right">
          <div class="meta">
            <entry-detail-section icon="error_outline">
              <entry-detail-footer :entry="orga"/>
            </entry-detail-section>
          </div>

          <entry-detail-section :title="$t('tabs.offers')" :icon="orga.offers.length ? 'favorite' : 'favorite'"
            :pullLesft="orga.offers.length"
            :clickLink="orga.offers.length ? 'Hinzufügen' : ''"
            @click="$router.push({name: 'offers.new', query: {actorId: orga.id}})">
            <entry-list-items
              :items="orga.offers"
              v-if="0 && orga.offers.length">
            </entry-list-items>

            <compact-offer-list v-if="orga.count_offers" :entry="orga" />

            <create-button-box
              v-else
              entryType="offers"
              action="createEntry"
              @action="$router.push({name: 'offers.new', query: {actorId: orga.id}})" />
          </entry-detail-section>

          <entry-detail-section :title="$t('tabs.events')" :icon="orga.count_events ? 'date_range' : 'date_range'"
            :pullLseft="orga.count_events"
            :clickLink="orga.count_events ? 'Hinzufügen' : ''"
            @click="$router.push({name: 'events.new', query: {actorId: orga.id}})">
            <tab-bar v-if="false && orga.count_events"
              :tabNames="eventTabNames" :isSubBar="true"
              :queryString="false"
              @setCurrentTab="setCurrentSubTab">
              <div slot="upcomingEvents">
                <entry-list-items
                  :items="orga.upcoming_events"
                  v-if="orga.upcoming_events.length"
                  :customSortOrders="[{ sort: sortByDateMixin, order: 'ASC' }]"
                  :options="{pagination: true, event_date: true}"
                  :modifyRoute="false">
                </entry-list-items>
              </div>
              <div slot="pastEvents">
                <entry-list-items
                  :items="orga.past_events"
                  v-if="orga.past_events.length"
                  :customSortOrders="[{ sort: sortByDateStart, order: 'DESC' }]"
                  :options="{pagination: true, event_date: true}"
                  :modifyRoute="false">
                </entry-list-items>
              </div>
            </tab-bar>

            <compact-event-list v-if="orga.count_events" :entry="orga" />

            <create-button-box
              v-else
              entryType="events"
              action="createEntry"
              @action="$router.push({name: 'events.new', query: {actorId: orga.id}})" />
          </entry-detail-section>

          <compact-annotation-list :entry="orga" />

        </div>
      </entry-detail-split-view>

      <section slot="resources" v-if="false && orga.resource_items.length">
        <resource-item v-for="resourceItem in orga.resource_items" :key="resourceItem.id" :resourceItem="resourceItem"
        :editEnabled="false"></resource-item>
      </section>
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
import EntryDescription from '@/components/entry/show/EntryDescription'
import ActorSelector from '@/components/actor/ActorSelector'
import EntryListItems from '@/components/entry/list/EntryListItems'
import CompactAnnotationList from '@/components/entry/list/compact/CompactAnnotationList'
import CompactEventList from '@/components/entry/list/compact/CompactEventList'
import CompactOfferList from '@/components/entry/list/compact/CompactOfferList'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'
import entryListFilters from '@/helpers/entry-list-filters'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this, this.id),
      sortByDateStart,
      sortByDateMixin,
      bus: this,
      showDescription: false
    }
  },

  computed: {
    orga () {
      return this.item
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
    EntryDescription,
    EntryListItems,
    EditableEntryFacetItems,
    CompactAnnotationList,
    CompactEventList,
    CompactOfferList
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
