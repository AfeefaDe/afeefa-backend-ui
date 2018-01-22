<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="entry">
      <div v-bind:class="['mainCard__header', 'mainCard__headerCategories', categoryClass]">
        <a href="" @click.prevent="goBack"><i class="material-icons go-back">chevron_left</i></a>
        <div class="mainCard__headerTitle">
          <h2 class="mainCard__headerTitleHeading">{{ entry.title || 'Kein Titel' }}</h2>
          <span v-if="entry.parent_orga" class="mainCard__headerSubtitle">
            <router-link :to="{name: entry.parent_orga.type + '.show', params: {id: entry.parent_orga.id}}">
              <u> {{ entry.parent_orga.title }}</u>
            </router-link>
          </span>
        </div>
        <div class="mainCard__headerButtonContainer">
          <a v-if="entryVisibleInFrontend" :href="previewLink" target="_blank" class="mainCard__headerButton">
            {{$t('headlines.preview')}}
            <i class="material-icons">link</i>
          </a>
          <a class="mainCard__headerButton" @click="togglePublishState">
            {{ entry.active ? $t('buttons.deactivate') : $t('buttons.activate') }}
            <i class="material-icons"><template v-if="entry.active">visibility</template><template v-else>visibility_off</template></i>
          </a>
          <router-link :to="{name: routeName + '.edit', params: {id: entry.id}, query:{tab: currentTab}}" class="mainCard__headerButton">
            {{$t('buttons.edit')}}
            <i class="material-icons">mode_edit</i>
          </router-link>
        </div>
      </div>

      <image-container
        :image-url="entry.media_url">
      </image-container>

      <entry-tabbed-content v-on:setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="generalTab">
          <ul class="entryDetail">
            <entry-detail-property v-if="entry.type === 'orgas'" name="Typ" hasEntryIcon="true" :entryIconType='entry.type' :entryIconStatus='entry.active' :entryIconClass="categoryClass">
              {{ getOrgaType(entry.orga_type_id).name }}
            </entry-detail-property>

            <entry-detail-property v-if="entry.type === 'orgas'" name="Projektträger" :iconName="'device_hub'">
              <div v-for="projectInitiator in entry.project_initiators" :key="projectInitiator.id">
                <router-link :to="{name: projectInitiator.type + '.show', params: {id: projectInitiator.id}}">
                  {{ projectInitiator.title }}
                </router-link>
              </div>
              <div v-if="!entry.project_initiators.length" class="entryDetail__error">Kein Projektträger angegeben</div>
            </entry-detail-property>

            <entry-detail-property v-if="entry.type === 'orgas'" name="Netzwerke" :iconName="'device_hub'">
              <div v-for="network in entry.networks" :key="network.id">
                <router-link :to="{name: network.type + '.show', params: {id: network.id}}">
                  {{ network.title }}
                </router-link>
              </div>
              <div v-if="!entry.networks.length" class="entryDetail__error">In keinem Netzwerk Mitglied</div>
            </entry-detail-property>

            <entry-detail-property v-if="entry.type === 'orgas'" name="Partner" :iconName="'device_hub'">
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

            <entry-detail-property v-if="entry.title" :name="$t('entries.title')" hasEntryIcon="true" :entryIconType='entry.type' :entryIconStatus='entry.active' :entryIconClass="categoryClass">
              {{ entry.title }}
            </entry-detail-property>

            <entry-detail-property
              v-if="entry.short_description || entry.inheritance.short_description && entry.parent_orga && entry.parent_orga.short_description"
              :name="$t('entries.short_description')"
              :iconName="'more_horiz'"
              :isMultiline="true">
              <div class="inheritedValue" v-if="entry.inheritance.short_description && entry.parent_orga">{{entry.parent_orga.short_description}}</div>
              <div v-if="entry.short_description">{{entry.short_description}}</div>
            </entry-detail-property>

            <entry-detail-property v-if="entry.description"  :name="$t('entries.description')" :iconName="'info_outline'" :isMultiline="true">{{ entry.description }}</entry-detail-property>

            <entry-detail-property :name="$t('entries.category')" :iconName="'bookmark_border'">
              {{ entry.category ? $t('categories.' + entry.category.title) : 'Keine Kategorie angegeben' }}
              <span v-if="entry.sub_category">> {{ $t('categories.' + entry.sub_category.title) }}</span>
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('entries.date')"
              :iconName="'date_range'"
              v-if="has.date && entry.date_start">
                {{ entry | formatEventDate }}
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

            <entry-detail-property
              :name="$tc('headlines.status')"
              :iconName= "entry.active ? 'visibility' : 'visibility_off'">
              <span>{{ $t('entries.created_at') }}: {{ entry.created_at | formatDateAbsolute }} ({{ entry.created_at | formatDateRelative }})</span>
              <span v-if="entry.creator"> von {{ entry.creator.name }} <span v-if="entry.creator.organization">({{ entry.creator.organization }})</span></span><br>
              <span>{{ $t('entries.updated_at') }}: {{ entry.updated_at | formatDateAbsolute }} ({{ entry.updated_at | formatDateRelative }})</span>
              <span v-if="entry.lastEditor">von {{ entry.lastEditor.name }} <span v-if="entry.lastEditor.organization">({{ entry.lastEditor.organization }})</span></span><br>
              <span>{{ $t('entries.state_changed_at') }}: {{ entry.state_changed_at | formatDateAbsolute }} ({{ entry.state_changed_at | formatDateRelative }})</span><br>
            </entry-detail-property>
          </ul>
        </section>

        <section slot="contactTab">
          <show-contact-info
            :location="entry.location"
            :contact-info="entry.contact"
            :inherited-contact-info="entry.inheritance.contact_infos"
            :parent-orga="entry.parent_orga"
            :currentTab="currentTab">
          </show-contact-info>
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
          <h2>{{ $t('headlines.upcomingEvents') }}</h2>

          <entry-list-items
            :items="upcomingEvents"
            v-if="upcomingEvents.length"
            :sort-function="sortByDateMixin"
            sort-order="ASC"
            :options="{event_date: true}">
          </entry-list-items>

          <h2>{{ $t('headlines.pastEvents') }}</h2>

          <entry-list-items
            :items="pastEvents"
            v-if="pastEvents.length"
            :sort-function="sortByDateStart"
            sort-order="DESC"
            :options="{event_date: true}">
          </entry-list-items>
        </section>
      </entry-tabbed-content>
    </div>

    <div v-else class="mainCard">
      <div class="mainCard__header mainCard__headerLight">
        <span v-if="entryLoadingError">{{ messages.loadingError() }}</span>
        <span v-else>{{ messages.loading() }} ...</span>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import Events from '@/resources/Events'
import Users from '@/resources/Users'
import OrgaType from '@/models/OrgaType'
import sortByDateStart from '@/helpers/sort-by-date-start'
import sortByDateMixin from '@/helpers/sort-by-date-mixin'
import slugify from '@/helpers/slugify'
import GenerateFrontendLinkMixin from '@/components/mixins/GenerateFrontendLinkMixin'

import EntryListItems from '@/components/EntryListItems'
import ImageContainer from '@/components/ImageContainer'
import EntryTabbedContent from '@/components/EntryTabbedContent'
import AnnotationTag from '@/components/AnnotationTag'
import ResourceItem from '@/components/ResourceItem'

import EntryDetailProperty from './EntryDetailProperty'
import EntryListDropDownMenu from './EntryListDropDownMenu'
import ShowContactInfo from './ShowContactInfo'

export default {
  props: ['entry', 'entryLoadingError', 'routeName', 'Resource', 'messages', 'options'],
  mixins: [GenerateFrontendLinkMixin],
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
    this.currentUser = Users.getCurrentUser()
  },
  watch: {
    entry () {
      // load past and upcoming events for orga
      if (this.entry && this.has.events) {
        Events.getAllForOrga(this.entry.id, 'upcoming').then(events => {
          this.upcomingEvents = events
        })
        Events.getAllForOrga(this.entry.id, 'past').then(events => {
          this.pastEvents = events
        })
      }
    }
  },

  methods: {
    togglePublishState () {
      this.$store.dispatch('messages/showDialog', {
        title: this.messages.activateHeadline(this.entry.active),
        message: this.messages.activate(this.entry.active)
      }).then(result => {
        if (result === 'yes') {
          this.currentlyPublishing = true
          const attributes = {
            active: !this.entry.active
          }
          this.Resource.updateAttributes(this.entry, attributes).then(attributes => {
            this.currentlyPublishing = false
            if (attributes) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.activated(attributes.active)
              })
            }
          })
        }
      })
    },
    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab
    },
    goBack () {
      this.$router.go(-1)
    },
    getOrgaType (id) {
      return OrgaType.getById(id)
    }
  },

  computed: {
    entryVisibleInFrontend () {
      return this.entry.active && ((this.entry.type === 'events' && this.entry.upcoming) || (this.entry.type === 'orgas'))
    },
    previewLink () {
      if (this.entry.type === 'orgas') {
        return `${this.frontendURL}/project/${this.entry.id}-${slugify.slugifyTitle(this.entry.title)}`
      } else if (this.entry.type === 'events') {
        return `${this.frontendURL}/event/${this.entry.id}-${slugify.slugifyTitle(this.entry.title)}`
      }
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
      let tabNames = ['generalTab', 'contactTab']
      if (this.entry.type === 'orgas' && this.entry.resource_items.length && this.currentUser.area === 'dresden') {
        tabNames.push('resourceTab')
      }
      if (this.entry.type === 'orgas') {
        if (this.entry.network_members.length) {
          tabNames.push('networkMembersTab')
        }
        tabNames.push('projectsTab')
        tabNames.push('eventsTab')
      }
      return tabNames
    }
  },

  components: {
    EntryListItems,
    ImageContainer,
    EntryDetailProperty,
    EntryTabbedContent,
    EntryListDropDownMenu,
    AnnotationTag,
    ShowContactInfo,
    ResourceItem
  }
}
</script>
