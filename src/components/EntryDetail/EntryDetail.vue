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

      <entry-tabbed-content v-on:setCurrentTab="setCurrentTab" :tabNames="['generalTab', 'placeTab', 'contactTab', 'resourceTab','linkTab']">
        <section slot="generalTab">
          <ul class="entryDetail">
            <entry-detail-property v-if="entry.title" :name="$t('entries.title')" hasEntryIcon="true" :entryIconType='entry.type' :entryIconStatus='entry.active' :entryIconClass="categoryClass">
              {{ entry.title }}
            </entry-detail-property>

            <entry-detail-property v-if="entry.short_description || entry.inheritance.short_description && entry.parent_orga && entry.parent_orga.short_description" :name="$t('entries.short_description')" :iconName="'more_horiz'" :isMultiline="true">
              <div class="inheritedValue" v-if="entry.inheritance.short_description && entry.parent_orga">{{entry.parent_orga.short_description}}</div>
              <div v-if="entry.short_description">{{entry.short_description}}</div>
            </entry-detail-property>

            <entry-detail-property v-if="entry.description"  :name="$t('entries.description')" :iconName="'info_outline'" :isMultiline="true">{{ entry.description }}</entry-detail-property>

            <entry-detail-property :name="$t('entries.category')" :iconName="'bookmark_border'">
              {{ entry.category ? entry.category.title : 'Keine Kategorie angegeben' }} >
              {{ entry.sub_category ? entry.sub_category.title : 'Keine Unterkategorie angegeben' }}
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
                  <li v-for="tag in entry.tags.split(',')" class="singleTag">
                    {{tag}}
                  </li>
                </ul>
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
              <span>{{ $t('entries.created_at') }}: {{ entry.created_at | formatDateAbsolute }} ({{ entry.created_at | formatDateRelative }})</span><br>
              <span>{{ $t('entries.updated_at') }}: {{ entry.updated_at | formatDateAbsolute }} ({{ entry.updated_at | formatDateRelative }})</span><br>
              <span>{{ $t('entries.state_changed_at') }}: {{ entry.state_changed_at | formatDateAbsolute }} ({{ entry.state_changed_at | formatDateRelative }})</span><br>
            </entry-detail-property>
          </ul>
        </section>

        <section slot="placeTab">
          <ul class="entryDetail" v-if="entry.location">
            <li v-if="entry.location.isEmpty()" class="entryDetail__error">
                {{ $t('errors.noLocationPresent') }}
            </li>
            <li v-else>
              <entry-detail-property v-if="!entry.location.isEmpty()" :name="$t('entries.address')" :iconName="'location_on'">
                  <span v-if="entry.location.placename">{{ entry.location.placename }}<br></span>
                  <span v-if="entry.location.street">{{ entry.location.street }}<br></span>
                  <span v-if="entry.location.zip || entry.location.city">{{ entry.location.zip }} {{ entry.location.city }}</span>
              </entry-detail-property>

              <entry-detail-property v-if="entry.location.directions" :name="$t('entries.directions')" :iconName="'train'" :isMultiline="true">{{ entry.location.directions }}</entry-detail-property>

              <li v-if="!entry.location.isEmpty()">
                <location-map :map-center="mapCenter" :location="entry.location" :currentTab="currentTab"></location-map>
              </li>
            </li>
          </ul>
        </section>

        <section slot="contactTab">
          <show-contact-info
            :contact-info="entry.contact"
            :inherited-contact-info="entry.inheritance.contact_infos"
            :parent-orga="entry.parent_orga">
          </show-contact-info>
        </section>

        <section slot="resourceTab">

        </section>


        <section slot="linkTab">
          <ul v-if="entry.type === 'events' && !entry.parent_orga" class="entryDetail__error entryDetail__error_white_space">
              {{ $t('errors.noLinksPresent') }}
          </ul>

          <ul v-if="entry.type === 'events' && entry.parent_orga">
            <entry-detail-property :name="$t('headlines.organizer')" hasEntryIcon="true" entryIconType='orgas' :entryIconStatus='false'>
              <entry-list-items
                :items="[entry.parent_orga]"
                v-if="entry.parent_orga"
                showIcon="false">
              </entry-list-items>
            </entry-detail-property>
          </ul>

          <ul class="entryDetail" v-if="entry.type === 'orgas'">
            <entry-detail-property :name="$tc('headlines.organisations', 2)" hasEntryIcon="true" entryIconType='orgas' :entryIconStatus='false'>

              <div v-if="has.parentOrga">
                <b>{{ $t('headlines.parentOrga') }}</b>
                <entry-list-items
                  :items="[entry.parent_orga]"
                  v-if="entry.parent_orga"
                  showIcon="false">
                </entry-list-items>
                <div v-else class="entryDetail__error">
                  {{ $t('errors.noParentOrgaPresent') }}
                </div>
              </div>

              <EntryListDropDownMenu :title="$t('headlines.subOrgas')" :numberOfItems="entry.sub_orgas.length" :isOpened="false" entryType="orgas">
                <entry-list-items
                  :items="entry.sub_orgas"
                  showIcon="false"
                  v-if="entry.sub_orgas.length">
                </entry-list-items>
                <div v-else class="entryDetail__error">
                  {{ $t('errors.noSubOrgaPresent') }}
                </div>
              </EntryListDropDownMenu>
            </entry-detail-property>

            <entry-detail-property :name="$tc('headlines.events', 2)" hasEntryIcon="true" entryIconType='events' :entryIconStatus='false'>
              <EntryListDropDownMenu :title="$t('headlines.upcomingEvents')" :numberOfItems="upcomingEvents.length" :isOpened="false" entryType="events">
                <entry-list-items
                  :items="upcomingEvents"
                  v-if="upcomingEvents.length"
                  :sort-function="sortByDateStart"
                  sort-order="ASC"
                  showIcon="false"
                  :options="{date_start: true}">
                </entry-list-items>
              </EntryListDropDownMenu>
              <br>
              <EntryListDropDownMenu :title="$t('headlines.pastEvents')" :numberOfItems="pastEvents.length" :isOpened="false" entryType="events">
                <entry-list-items
                :items="pastEvents"
                v-if="pastEvents.length"
                :sort-function="sortByDateStart"
                sort-order="DESC"
                showIcon="false"
                :options="{date_start: true}">
              </entry-list-items>
            </EntryListDropDownMenu>
          </entry-detail-property>
        </ul>
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
import sortByDateStart from '@/helpers/sort-by-date-start'

import EntryListItems from '@/components/EntryListItems'
import LocationMap from '@/components/Map'
import ImageContainer from '@/components/ImageContainer'
import EntryTabbedContent from '@/components/EntryTabbedContent'
import AnnotationTag from '@/components/AnnotationTag'

import EntryDetailProperty from './EntryDetailProperty'
import EntryListDropDownMenu from './EntryListDropDownMenu'
import ShowContactInfo from './ShowContactInfo'

export default {
  props: ['entry', 'entryLoadingError', 'routeName', 'Resource', 'messages', 'options'],

  data () {
    const options = this.options || {}
    return {
      pastEvents: [],
      upcomingEvents: [],
      filterOrgaEventsBy: 'upcoming',
      orgaEventsSortOrder: 'ASC',
      sortByDateStart,
      currentTab: '',
      currentlyPublishing: false,
      has: {
        date: options.hasDate,
        parentOrga: options.hasParentOrga,
        orga: options.hasOrga,
        events: options.hasEvents
      }
    }
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
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.currentUser
    },
    entryVisibleInFrontend () {
      return this.entry.active && ((this.entry.type === 'events' && this.entry.upcoming) || (this.entry.type === 'orgas'))
    },
    mapCenter () {
      if (this.entry.location && this.entry.location.lat) {
        return [this.entry.location.lat, this.entry.location.lon]
      } else {
        return [51.0571904, 13.7154319]
      }
    },
    /*
     * shitty implementation of preview links, not working for areas!=dresden in dev mode (#338)
     */
    previewLink () {
      let previewLink = '//'
      if (this.currentUser && this.currentUser.area.toLowerCase() !== 'Dresden'.toLowerCase()) {
        previewLink += this.currentUser.area + '.'
      }
      if (this.entry.type === 'orgas') {
        return previewLink + `${process.env.FRONTEND_URL}project/${this.entry.id}`
      } else if (this.entry.type === 'events') {
        return previewLink + `${process.env.FRONTEND_URL}event/${this.entry.id}`
      }
    },
    categoryClass () {
      if (this.entry.category && this.entry.category.title) {
        return 'cat-' + this.entry.category.title
      }
    }
  },

  components: {
    EntryListItems,
    LocationMap,
    ImageContainer,
    EntryDetailProperty,
    EntryTabbedContent,
    EntryListDropDownMenu,
    AnnotationTag,
    ShowContactInfo
  }
}
</script>
