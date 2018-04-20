<template>
  <afeefa-page>

    <entry-header :entry="entry" :routeConfig="routeConfig" slot="header" />

    <div slot="content" v-if="entry">
      <image-container
        :image-url="entry.media_url">
      </image-container>

      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="generalTab" class="generalTab generalTab--splitView">

          <div class="entryDetail generalTab__splitViewChild">

          <entry-text-attribute
            v-if="false"
            :attribute="entry.title"
            :name="$t('entries.title')"
            :isMultiline="false"
            :maxChar="150"
            validate="required|max:150"
            fieldName="title"
            :editable="true"/>

            <entry-detail-property
              v-if="entry.type === 'orgas'"
              name="Angebote"
              iconName="bookmark_border">
              <div v-for="offer in entry.offers" :key="offer.id">
                <router-link :to="{name: 'offers.show', params: {id: offer.id}}">
                  {{ offer.title }}
                </router-link>
              </div>
            </entry-detail-property>

            <entry-detail-property
              name="Kategorien"
              iconName="bookmark_border">
              <entry-facet-items :entry="entry" :isEdit="true" />
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('entries.date')"
              :iconName="'date_range'"
              v-if="has.date && entry.date_start">
                {{ entry | formatEventDate }}
                <span>({{entry.date_start | formatDateRelative}})</span>
            </entry-detail-property>

            <entry-detail-property name="Veranstalter" :iconName="'device_hub'" v-if="entry.type==='events'">
              <event-hosts :owner="entry" relationName="hosts" title="Veranstalter">
                <div slot="actor" slot-scope="props">
                  <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                    {{ props.actor.title }}
                  </router-link>
                </div>
              </event-hosts>
            </entry-detail-property>

            <entry-detail-property v-if="entry.type === 'orgas'" name="Projektträger" :iconName="'device_hub'">
              <actor-actors :owner="entry" relationName="project_initiators" title="Projektträger">
                <div slot="actor" slot-scope="props">
                  <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                    {{ props.actor.title }}
                  </router-link>
                </div>
              </actor-actors>
            </entry-detail-property>

            <entry-detail-property v-if="entry.type === 'orgas'" name="Netzwerke">
              <actor-actors :owner="entry" relationName="networks" title="Netzwerke">
                <div slot="actor" slot-scope="props">
                  <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                    {{ props.actor.title }}
                  </router-link>
                </div>
              </actor-actors>
            </entry-detail-property>

            <entry-detail-property v-if="entry.type === 'orgas'" name="Partner">
              <actor-actors :owner="entry" relationName="partners" title="Partner">
                <div slot="actor" slot-scope="props">
                  <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                    {{ props.actor.title }}
                  </router-link>
                </div>
              </actor-actors>
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.description')"
              :iconName="'more_horiz'"
              :isMultiline="true">
              <div v-if="entry.short_description">{{entry.short_description}}</div>
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.support_wanted')"
              :iconName="'pan_tool'"
              v-if="entry.support_wanted">
                <template v-if="entry.support_wanted_detail">
                  {{entry.support_wanted_detail}}
                </template>
                <template v-else>
                  {{$t('entries.support_wanted_yes')}}
                </template>
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.certified_sfr')"
              :iconName="'check_circle'"
              v-if="entry.certified_sfr">
                {{$t('entries.certified_sfr_yes')}}
            </entry-detail-property>

            <entry-detail-property
              v-if="entry.tags"
              :name="$tc('entries.tags', entry.tags.split(',').length)"
              :iconName="'more_vert'">
                <ul>
                  <li v-for="tag in entry.tags.split(',')" :key="tag" class="singleTag">
                    {{tag}}
                  </li>
                </ul>
            </entry-detail-property>

            <entry-detail-property
              name="Facebook ID für Events"
              iconName="share"
              v-if="entry.type === 'orgas'">
              {{ entry.facebook_id || 'Keine ID angegeben'}}
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('headlines.annotations', entry.annotations.length)"
              :iconName="'label_outline'"
              v-if="entry.annotations.length">
              <div>
                <annotation-tag v-for="annotation in entry.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>
              </div>
            </entry-detail-property>

            </div>
            <contact-list :item="entry" class="generalTab__splitViewChild"/>
            <entry-detail-footer :entry="entry"/>
        </section>

        <section slot="resourceTab" v-if="entry.type === 'orgas' && entry.resource_items.length">
          <resource-item v-for="resourceItem in entry.resource_items" :key="resourceItem.id" :resourceItem="resourceItem"
          :editEnabled="false"></resource-item>
        </section>

        <section slot="networkMembersTab" v-if="entry.type === 'orgas'">
          <actor-selector title="Netzwerkmitglieder ändern" :actor="entry" relationName="network_members" @saved="actorRelationSaved" />

          <entry-list-items
            :items="entry.network_members"
            v-if="entry.network_members.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Mitglieder zugeordnet
          </div>

          <actor-selector title="Netzwerkmitglieder ändern" :actor="entry" relationName="network_members" @saved="actorRelationSaved" />
        </section>

        <section slot="projectsTab" v-if="entry.type === 'orgas'">
          <actor-selector title="Projekte ändern" :actor="entry" relationName="projects" @saved="actorRelationSaved" />

          <entry-list-items
            :items="entry.projects"
            v-if="entry.projects.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Projekte zugeordnet
          </div>

          <actor-selector title="Projekte ändern" :actor="entry" relationName="projects" @saved="actorRelationSaved" />
        </section>

        <section slot="eventsTab" v-if="entry.type === 'orgas'">
          <h5>{{ $t('headlines.upcomingEvents') }}</h5>

          <entry-list-items
            :items="entry.upcoming_events"
            v-if="entry.upcoming_events.length"
            :sort-function="sortByDateMixin"
            sort-order="ASC"
            :options="{event_date: true}">
          </entry-list-items>

          <h5>{{ $t('headlines.pastEvents') }}</h5>

          <entry-list-items
            :items="entry.past_events"
            v-if="entry.past_events.length"
            :sort-function="sortByDateStart"
            sort-order="DESC"
            :options="{event_date: true}">
          </entry-list-items>
        </section>
      </tab-bar>
    </div>

    <div slot="content" v-else>
      <entry-loading-message2 :error="entryLoadingError" :messages="messages" />
    </div>

  </afeefa-page>
</template>

<script>
import User from '@/models/User'

import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByDateMixin from '@/helpers/sort-by-date-mixin'

import EntryLoadingMessage2 from '@/components/entry/EntryLoadingMessage2'
import EntryListItems from '@/components/entry/EntryListItems'
import EntryIcon from '@/components/entry/EntryIcon'
import EntryFacetItems from '@/components/entry/EntryFacetItems'
import ContactList from '@/components/contact/ContactList'

import ImageContainer from '@/components/ImageContainer'
import TabBar from '@/components/TabBar'
import AnnotationTag from '@/components/AnnotationTag'
import ResourceItem from '@/components/ResourceItem'

import EntryDetailProperty from './EntryDetailProperty'
import EntryTextAttribute from './EntryTextAttribute'

import EntryDetailFooter from './EntryDetailFooter'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

import EventHosts from './relations/EventHosts'
import ActorActors from './relations/ActorActors'
import ActorSelector from '@/components/selector/ActorSelector'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['entry', 'entryLoadingError', 'options'],

  data () {
    const options = this.options || {}
    return {
      sortByDateStart,
      sortByDateMixin,
      currentTab: '',
      currentlyPublishing: false,
      currentUser: null,
      has: {
        date: options.hasDate,
        parentOrga: options.hasParentOrga,
        orga: options.hasOrga,
        events: options.hasEvents
      }
    }
  },

  created () {
    this.currentUser = User.Query.getCurrentUser()
  },

  methods: {
    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab
    },

    actorRelationSaved () {
      this.entry.$rels.actor_relations.refetch()
    }
  },

  computed: {
    /*
     * define tabNames according to the entry type and the area of the current user
     */
    tabNames () {
      let tabNames = ['generalTab']
      if (this.entry.type === 'orgas' && this.currentUser.area === 'dresden') {
        tabNames.push({name: 'resourceTab', hint: this.entry.resource_items.length})
      }
      if (this.entry.type === 'orgas') {
        tabNames.push({name: 'networkMembersTab', hint: this.entry.network_members.length})
        tabNames.push({name: 'projectsTab', hint: this.entry.projects.length})
        tabNames.push({name: 'eventsTab', hint: this.entry.upcoming_events.length + this.entry.past_events.length})
      }
      return tabNames
    }
  },

  components: {
    EntryLoadingMessage2,
    EntryIcon,
    EntryListItems,
    ImageContainer,
    EntryDetailProperty,
    EntryTextAttribute,
    TabBar,
    AnnotationTag,
    ContactList,
    ResourceItem,
    EntryFacetItems,
    EntryDetailFooter,
    EventHosts,
    ActorActors,
    ActorSelector
  }
}
</script>

<style lang="scss" scoped>
.treeItemTag {
  display: inline-block;
  margin-right: .4em;
  margin-bottom: .4em;
}

.generalTab--splitView {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > * {
    width: 100%;
  }
  > .generalTab__splitViewChild {
    width: 50%;
    padding: 1em;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
  }
}
</style>
