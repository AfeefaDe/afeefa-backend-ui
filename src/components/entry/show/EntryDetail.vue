<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard" v-if="entry">
        <entry-detail-header
          :entry="entry"
          :routeConfig="routeConfig"
          :currentTab="currentTab">
          </entry-detail-header>

        <image-container
          :image-url="entry.media_url">
        </image-container>

        <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
          <section slot="generalTab" class="generalTab generalTab--splitView">
            <div class="entryDetail generalTab__splitViewChild">
              <entry-detail-property
                :name="$tc('entries.date')"
                :iconName="'date_range'"
                v-if="has.date && entry.date_start">
                  {{ entry | formatEventDate }}
                  <span>({{entry.date_start | formatDateRelative}})</span>
              </entry-detail-property>

              <entry-detail-property v-if="entry.type === 'orgas'" name="Projektträger" :iconName="'device_hub'">
                <div v-for="projectInitiator in entry.project_initiators" :key="projectInitiator.id">
                  <router-link :to="{name: projectInitiator.type + '.show', params: {id: projectInitiator.id}}">
                    {{ projectInitiator.title }}
                  </router-link>
                </div>
                <div v-if="!entry.project_initiators.length" class="entryDetail__error">Kein Projektträger angegeben</div>
              </entry-detail-property>

              <entry-detail-property v-if="entry.type === 'orgas'" name="Netzwerke">
                <div v-for="network in entry.networks" :key="network.id">
                  <router-link :to="{name: network.type + '.show', params: {id: network.id}}">
                    {{ network.title }}
                  </router-link>
                </div>
                <div v-if="!entry.networks.length" class="entryDetail__error">In keinem Netzwerk Mitglied</div>
              </entry-detail-property>

              <entry-detail-property v-if="entry.type === 'orgas'" name="Partner">
                <div v-for="partner in entry.partners" :key="partner.id">
                  <router-link :to="{name: partner.type + '.show', params: {id: partner.id}}">
                    {{ partner.title }}
                  </router-link>
                </div>
                <div v-if="!entry.partners.length" class="entryDetail__error">Keine Partner angegeben</div>
              </entry-detail-property>

              <ul v-if="entry.type === 'events'">
                <entry-detail-property :name="$t('headlines.organizer')" :iconName="'device_hub'">
                  <entry-list-items
                    :items="[entry.parent_orga]"
                    v-if="entry.parent_orga"
                    showIcon="false">
                  </entry-list-items>
                  <div v-if="!entry.parent_orga" class="entryDetail__error">Kein Veranstalter angegeben</div>
                </entry-detail-property>
              </ul>

              <entry-detail-property :name="$t('entries.category')" :iconName="'bookmark_border'">
                {{ entry.category ? $t('categories.' + entry.category.title) : 'Keine Kategorie angegeben' }}
                <span v-if="entry.sub_category">> {{ $t('categories.' + entry.sub_category.title) }}</span>
              </entry-detail-property>

              <entry-detail-property
                v-if="showShortDescription"
                :name="$t('entries.short_description')"
                :iconName="'more_horiz'"
                :isMultiline="true">
                <div class="inheritedValue" v-if="entry.inheritance.short_description && entry.parent_orga">{{entry.parent_orga.short_description}}</div>
                <div v-if="entry.short_description">{{entry.short_description}}</div>
              </entry-detail-property>

              <entry-detail-property
                v-if="entry.description"
                :name="$t('entries.description')"
                :iconName="showShortDescription ? null : 'more_horiz'"
                :isMultiline="true">
                <span>{{ entry.description }}</span>
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
            <entry-detail-property v-if="entry.type === 'orgas'" name="Netzwerkmitglieder" :iconName="'device_hub'">
              <div v-for="member in entry.network_members" :key="member.id">
                <router-link :to="{name: member.type + '.show', params: {id: member.id}}">
                  {{ member.title }}
                </router-link>
              </div>
              <div v-if="!entry.network_members.length" class="entryDetail__error">Keine Netzwerkmitglieder</div>
            </entry-detail-property>
          </section>

          <section slot="projectsTab" v-if="entry.type === 'orgas'">
            <entry-list-items
              :items="entry.projects"
              v-if="entry.projects.length">
            </entry-list-items>
            <div v-else class="entryDetail__error">
              Keine Projekte zugeordnet
            </div>
          </section>

          <section slot="eventsTab" v-if="entry.type === 'orgas'">
            <h5>{{ $t('headlines.upcomingEvents') }}</h5>

            <entry-list-items
              :items="upcomingEvents"
              v-if="upcomingEvents.length"
              :sort-function="sortByDateMixin"
              sort-order="ASC"
              :options="{event_date: true}">
            </entry-list-items>

            <h5>{{ $t('headlines.pastEvents') }}</h5>

            <entry-list-items
              :items="pastEvents"
              v-if="pastEvents.length"
              :sort-function="sortByDateStart"
              sort-order="DESC"
              :options="{event_date: true}">
            </entry-list-items>
          </section>
        </tab-bar>
      </div>
      <entry-loading-message v-else :error="entryLoadingError" :messages="messages" />
    </div>
  </div>
</template>

<script>
import Event from '@/models/Event'
import User from '@/models/User'
import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByDateMixin from '@/helpers/sort-by-date-mixin'

import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryListItems from '@/components/entry/EntryListItems'
import EntryIcon from '@/components/entry/EntryIcon'
import ContactList from '@/components/contact/ContactList'

import ImageContainer from '@/components/ImageContainer'
import TabBar from '@/components/TabBar'
import AnnotationTag from '@/components/AnnotationTag'
import ResourceItem from '@/components/ResourceItem'

import EntryDetailProperty from './EntryDetailProperty'
import EntryDetailHeader from './EntryDetailHeader'
import EntryDetailFooter from './EntryDetailFooter'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['entry', 'entryLoadingError', 'options'],

  data () {
    const options = this.options || {}
    return {
      pastEvents: [],
      upcomingEvents: [],
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
    this.currentUser = User.getCurrentUser()
  },

  watch: {
    entry () {
      // load past and upcoming events for orga
      if (this.entry && this.has.events) {
        Event.getAllForOrga(this.entry.id, 'upcoming').then(events => {
          this.upcomingEvents = events
        })
        Event.getAllForOrga(this.entry.id, 'past').then(events => {
          this.pastEvents = events
        })
      }
    }
  },

  methods: {
    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab
    }
  },

  computed: {
    showShortDescription () {
      return this.entry.short_description ||
        (this.entry.inheritance.short_description &&
        this.entry.parent_orga &&
        this.entry.parent_orga.short_description)
    },

    categoryClass () {
      if (this.entry.category && this.entry.category.title) {
        return 'cat-' + this.entry.category.title
      }
    },
    /*
     * define tabNames according to the entry type and the area of the current user
     */
    tabNames () {
      let tabNames = ['generalTab']
      if (this.entry.type === 'orgas' && this.currentUser.area === 'dresden') {
        tabNames.push({name: 'resourceTab', hint: this.entry.resource_items.length})
      }
      if (this.entry.type === 'orgas') {
        if (this.entry.network_members.length) {
          tabNames.push({name: 'networkMembersTab', hint: this.entry.network_members.length})
        }
        tabNames.push({name: 'projectsTab', hint: this.entry.projects.length})
        tabNames.push({name: 'eventsTab', hint: this.upcomingEvents.length + this.pastEvents.length})
      }
      return tabNames
    }
  },

  components: {
    EntryLoadingMessage,
    EntryIcon,
    EntryListItems,
    ImageContainer,
    EntryDetailProperty,
    TabBar,
    AnnotationTag,
    ContactList,
    ResourceItem,
    EntryDetailHeader,
    EntryDetailFooter
  }
}
</script>

<style lang="scss" scoped>
.generalTab--splitView {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > * {
    width: 100%;
  }
  > .generalTab__splitViewChild {
    width: 50%;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
  }
}
</style>
