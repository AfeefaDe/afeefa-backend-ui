<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="orga" :routeConfig="routeConfig" slot="headerButtons" v-if="orga" />

    <div slot="secondaryHeaderButtons" class="secondaryHeaderButtons" v-if="orga">
      <router-link :to="{name: 'offers.new', query: {actorId: orga.id}}" class="btn gray btn-small">
        <i class="material-icons left">add</i>
        <i class="material-icons left">message</i>
        Angebot
      </router-link>

      <router-link :to="{name: 'events.new', query: {actorId: orga.id}}" class="btn gray btn-small">
        <i class="material-icons left">add</i>
        <i class="material-icons left">date_range</i>
        Veranstaltung
      </router-link>
    </div>

    <div v-if="orga">
      <image-container :image-url="orga.media_url" />

      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="general">
          <tab-bar @setCurrentTab="setCurrentSubTab" :tabNames="generalTabNames" :isSubBar="true">
            <div slot="overview" class="overview splitView">

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

              <div class="entryDetail splitView__splitViewChild">
                <entry-detail-property name="Projektträger" iconName="group">
                  <editable-actor-actors :owner="orga" relationName="project_initiators" title="Projektträger" :showActors="true">
                    <div slot="actor" slot-scope="props">
                      <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                        {{ props.actor.title }}
                      </router-link>
                    </div>
                  </editable-actor-actors>
                </entry-detail-property>

                <entry-detail-property
                  :name="$t('entries.description')"
                  iconName="format_align_left"
                  :isMultiline="true">
                  <div v-if="orga.short_description">{{orga.short_description}}</div>
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
                  <editable-entry-navigation-items :entry="orga" :isEdit="true" />
                </entry-detail-property>

                <entry-detail-property name="Netzwerke" iconName="group">
                  <editable-actor-actors :owner="orga" relationName="networks" title="Netzwerke" :showActors="true">
                    <div slot="actor" slot-scope="props">
                      <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                        {{ props.actor.title }}
                      </router-link>
                    </div>
                  </editable-actor-actors>
                </entry-detail-property>

                <entry-detail-property name="Partner">
                  <editable-actor-actors :owner="orga" relationName="partners" title="Partner" :showActors="true">
                    <div slot="actor" slot-scope="props">
                      <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                        {{ props.actor.title }}
                      </router-link>
                    </div>
                  </editable-actor-actors>
                </entry-detail-property>
              </div>

              <div class="splitView__splitViewChild">
                <contact-list :item="orga" />
              </div>

              <entry-detail-footer :entry="orga"/>

            </div>

            <div slot="todos">
              <annotation-view :entry="orga" />
            </div>

            <div slot="attributes">
              <entry-detail-property
                name="Facebook ID für Events"
                iconName="share">
                {{ orga.facebook_id || 'Keine ID angegeben'}}
              </entry-detail-property>

              <entry-detail-property
                :name="$t('entries.certified_sfr')"
                :iconName="'check_circle'">
                  {{orga.certified_sfr ? $t('entries.certified_sfr_yes') : $t('entries.certified_sfr_no')}}
              </entry-detail-property>

              <entry-detail-property
                :name="$t('entries.support_wanted')"
                :iconName="'pan_tool'">
                  <template v-if="orga.support_wanted_detail">
                    {{orga.support_wanted_detail}}
                  </template>
                  <template v-else>
                    {{orga.support_wanted ? $t('entries.support_wanted_yes') : $t('entries.support_wanted_no')}}
                  </template>
              </entry-detail-property>
            </div>

          </tab-bar>
        </section>

        <section slot="resources" v-if="orga.resource_items.length">
          <resource-item v-for="resourceItem in orga.resource_items" :key="resourceItem.id" :resourceItem="resourceItem"
          :editEnabled="false"></resource-item>
        </section>

        <section slot="networkMembers">
          <actor-selector title="Netzwerkmitglieder ändern" :actor="orga" relationName="network_members" @saved="actorRelationSaved('network_members')" />

          <entry-list-items
            :items="orga.network_members"
            v-if="orga.network_members.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Mitglieder zugeordnet
          </div>

          <actor-selector title="Netzwerkmitglieder ändern" :actor="orga" relationName="network_members" @saved="actorRelationSaved('network_members')" />
        </section>

        <section slot="offers">
          <entry-list-items
            :items="orga.offers"
            v-if="orga.offers.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Angebote zugeordnet
          </div>

          <actor-selector title="Netzwerkmitglieder ändern" :actor="orga" relationName="network_members" @saved="actorRelationSaved('network_members')" />
        </section>

        <section slot="projects">
          <actor-selector title="Projekte ändern" :actor="orga" relationName="projects" @saved="actorRelationSaved('projects')" />

          <entry-list-items
            :items="orga.projects"
            v-if="orga.projects.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Projekte zugeordnet
          </div>

          <actor-selector title="Projekte ändern" :actor="orga" relationName="projects" @saved="actorRelationSaved('projects')" />
        </section>

        <section slot="events">

          <tab-bar @setCurrentTab="setCurrentSubTab" :tabNames="eventTabNames" :isSubBar="true" v-if="orga.count_events">
            <div slot="upcomingEvents">
              <entry-list-items
                :items="orga.upcoming_events"
                v-if="orga.upcoming_events.length"
                :sort-function="sortByDateMixin"
                sort-order="ASC"
                :options="{pagination: true, event_date: true}">
              </entry-list-items>
            </div>
            <div slot="pastEvents">
              <entry-list-items
                :items="orga.past_events"
                v-if="orga.past_events.length"
                :sort-function="sortByDateStart"
                sort-order="DESC"
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
import EditableActorActors from '@/components/actor/EditableActorActors'
import ActorSelector from '@/components/actor/ActorSelector'
import EntryListItems from '@/components/entry/list/EntryListItems'
import AnnotationView from '@/components/annotation/AnnotationView'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'

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

    generalTabNames () {
      let tabNames = ['overview']
      // if (this.orga.annotations.length) {
      //   }
      tabNames.push({name: 'todos', hint: this.orga.annotations.length})
      tabNames.push('attributes')
      return tabNames
    },

    tabNames () {
      let tabNames = ['general']
      // if (this.orga.offers.length) {
      //   }
      // if (this.orga.upcoming_events.length + this.orga.past_events.length) {
      //   }
      // if (this.orga.projects.length) {
      //   }
      // if (this.orga.network_members.length) {
      //   }
      // if (this.currentUser.area === 'dresden' && this.orga.resource_items.length) {
      //   }
      tabNames.push({name: 'offers', hint: this.orga.offers.length})
      tabNames.push({name: 'events', hint: this.orga.upcoming_events.length + this.orga.past_events.length})
      tabNames.push({name: 'projects', hint: this.orga.projects.length})
      tabNames.push({name: 'networkMembers', hint: this.orga.network_members.length})
      tabNames.push({name: 'resources', hint: this.orga.resource_items.length})
      return tabNames
    }
  },

  methods: {
    actorRelationSaved (relationName) {
      this.orga.$rels[relationName].refetch()
    }
  },

  components: {
    EntryDetailHeaderButtons,
    ImageContainer,
    EditableEntryNavigationItems,
    EditableActorActors,
    ContactList,
    EntryDetailFooter,
    ActorSelector,
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
  & > &__splitViewChild {
    width: 50%;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
  }

  &.overview {
    position: relative;
  }
}
</style>
