<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="entry">
      <div class="mainCard__header mainCard__headerGreen">
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
          <a v-if="entry.active" :href="previewLink" target="_blank" class="mainCard__headerButton">
            {{$t('headlines.preview')}}
          </a>
          <router-link :to="{name: routeName + '.edit', params: {id: entry.id}, query:{tab: currentTab}}" class="mainCard__headerButton">
            Bearbeiten
            <i class="material-icons">mode_edit</i>
          </router-link>
        </div>
      </div>

      <image-container
        :image-url="entry.media_url">
      </image-container>

      <entry-tabbed-content v-on:setCurrentTab="setCurrentTab">
        <section slot="generalTab">
          <ul class="entryDetail">
            <entry-detail-property v-if="entry.title" :name="$t('entries.title')" hasEntryIcon="true" :entryIconType='entry.type' :entryIconStatus='entry.active' >
              {{ entry.title }}
            </entry-detail-property>

            <entry-detail-property v-if="entry.short_description || entry.inheritance.short_description" :name="$t('entries.short_description')" :iconName="'more_horiz'" :isMultiline="true">
              <p class="inheritedValue" v-if="entry.inheritance.short_description && entry.parent_orga">{{entry.parent_orga.short_description}}</p>
              <span v-if="entry.short_description">{{ entry.short_description }}</span>
            </entry-detail-property>

            <entry-detail-property v-if="entry.description"  :name="$t('entries.description')" :iconName="'info_outline'" :isMultiline="true">{{ entry.description }}</entry-detail-property>

            <entry-detail-property :name="$t('entries.category')" :iconName="'bookmark_border'">
              {{ entry.category ? entry.category.title : 'Keine Kategorie angegeben' }} >
              {{ entry.sub_category ? entry.sub_category.title : 'Keine Unterkategorie angegeben' }}
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('entries.date')"
              :iconName="'date_range'"
              v-if="has.date">
                {{ entry | formatEventDate }}
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.for_children')"
              :iconName="'child_friendly'"
              v-if="entry.for_children">
                 {{$t('entries.for_children_yes')}}
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.support_wanted')"
              :iconName="'pan_tool'"
              v-if="entry.support_wanted">
                 {{$t('entries.support_wanted_yes')}}
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
                 {{entry.tags}}
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('headlines.annotations', entry.annotations.length)"
              :iconName="'label_outline'">
              <div v-if="entry.annotations.length">
                <annotation-tag v-for="annotation in entry.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>
              </div>
              <div v-else class="entryDetail__error">
                {{ $t('errors.noAnnotationPresent') }}
              </div>
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('headlines.status')"
              :iconName= "entry.active ? 'visibility' : 'visibility_off'">
              <button @click="togglePublishState" :class="['btn', 'publishButton', 'waves-effect', {green: entry.active}]" type="submit">
                {{ entry.active ? $t('buttons.deactivate') : $t('buttons.activate') }}
              </button><br><br>
              <span>{{ $t('entries.created_at') }}: {{ entry.created_at | formatDateAbsolute }} ({{ entry.created_at | formatDateRelative }})</span><br>
              <span>{{ $t('entries.updated_at') }}: {{ entry.updated_at | formatDateAbsolute }} ({{ entry.updated_at | formatDateRelative }})</span><br>
              <span>{{ $t('entries.state_changed_at') }}: {{ entry.state_changed_at | formatDateAbsolute }} ({{ entry.state_changed_at | formatDateRelative }})</span><br>
            </entry-detail-property>
          </ul>
        </section>

        <section slot="placeTab">
          <ul class="entryDetail" v-if="entry.location">
            <li v-if="entry.location.isEmpty()" class="entryDetail__error">
              <template v-if="entry.inheritance.locations && entry.parent_orga"></template>
              <template v-else>
                {{ $t('errors.noLocationPresent') }}
              </template>
            </li>
            <li v-else>
              <entry-detail-property v-if="!entry.location.isEmpty()" :name="$t('entries.address')" :iconName="'location_on'">
                  <span v-if="entry.location.placename">{{ entry.location.placename }}<br></span>
                  <span v-if="entry.location.street">{{ entry.location.street }}<br></span>
                  <span v-if="entry.location.zip || entry.location.city">{{ entry.location.zip }} {{ entry.location.city }}</span>
              </entry-detail-property>

              <entry-detail-property v-if="entry.location.directions" :name="$t('entries.directions')" :iconName="'train'" :isMultiline="true">{{ entry.location.directions }}</entry-detail-property>

              <li v-if="!entry.location.isEmpty()">
                <location-map :map-center="mapCenter" :location="entry.location"></location-map>
              </li>
            </li>
          </ul>
        </section>

        <section slot="contactTab">
          <ul class="entryDetail" v-if="entry.contact">

            <li v-if="entry.contact.isEmpty() && !(entry.inheritance.contact_infos && entry.parent_orga)" class="entryDetail__error">
                {{ $t('errors.noContactPresent') }}
            </li>

            <li v-else>
              <entry-detail-property
                :name="$t('headlines.contact')"
                :iconName="'mail_outline'"
                v-if="entry.contact.person || entry.contact.phone || entry.contact.mail || showInheritValue('person') || showInheritValue('phone') || showInheritValue('mail')">
                  <span v-if="entry.contact.person">{{ entry.contact.person }}<br></span>
                  <span class="inheritedValue" v-else-if="showInheritValue('person')">{{ showInheritValue('person') }}<br></span>

                  <span v-if="entry.contact.phone">{{ entry.contact.phone }}<br></span>
                  <span class="inheritedValue" v-else-if="showInheritValue('phone')">{{ showInheritValue('phone')}}<br></span>

                  <a v-if="entry.contact.mail" :href="'mailto:' + entry.contact.mail">{{ entry.contact.mail }}</a>
                  <a class="inheritedValue" v-else-if="showInheritValue('mail')" :href="'mailto:'+ showInheritValue('mail')">{{ showInheritValue('mail')}}</a>
              </entry-detail-property>

              <entry-detail-property
                v-if="entry.contact.openingHours || showInheritValue('openingHours')"
                :name="$t('entries.openingHours')"
                :iconName="'access_time'"
                :isMultiline="true">
                <div v-if="entry.contact.openingHours">{{ entry.contact.openingHours }}</div>
                <div v-else class="inheritedValue">{{showInheritValue('openingHours')}}</div>
              </entry-detail-property>

              <entry-detail-property
                :name="'Links'"
                :iconName="'link'"
                v-if="entry.contact.web || entry.contact.socialMedia || showInheritValue('web') || showInheritValue('socialMedia')">
                  <span v-if="entry.contact.web">
                    <a :href="entry.contact.web" target="_blank">{{ entry.contact.web }}</a><br>
                  </span>
                  <span v-else-if="showInheritValue('web')" class="inheritedValue">
                    <a :href="showInheritValue('web')" target="_blank">{{ showInheritValue('web') }}</a><br>
                  </span>

                  <span v-if="entry.contact.socialMedia">
                    <a :href="entry.contact.socialMedia" target="_blank">{{ entry.contact.socialMedia }}</a>
                  </span>
                  <span v-else-if="showInheritValue('socialMedia')" class="inheritedValue" >
                    <a :href="showInheritValue('socialMedia')" target="_blank">{{ showInheritValue('socialMedia') }}</a>
                  </span>
              </entry-detail-property>

              <entry-detail-property
                v-if="entry.contact.spokenLanguages"
                :name="$tc('headlines.spokenLanguages', entry.contact.spokenLanguages.split(',').length)"
                :iconName="'translate'">
                  {{stringifySpokenLanguages(entry.contact.spokenLanguages)}}
              </entry-detail-property>
              <entry-detail-property
                v-else-if="showInheritValue('spokenLanguages')"
                :name="$tc('headlines.spokenLanguages', showInheritValue('spokenLanguages').split(',').length)"
                :iconName="'translate'">
                  <div class="inheritedValue">
                    {{stringifySpokenLanguages(showInheritValue('spokenLanguages'))}}
                  </div>
              </entry-detail-property>
            </li>

          </ul>
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
import EntryListItems from '@/components/EntryListItems'
import LocationMap from '@/components/Map'
import ImageContainer from '@/components/ImageContainer'
import EntryDetailProperty from '@/components/EntryDetailProperty'
import EntryTabbedContent from '@/components/EntryTabbedContent'
import EntryListDropDownMenu from '@/components/EntryListDropDownMenu'
import AnnotationTag from '@/components/AnnotationTag'
import Events from '@/resources/Events'
import sortByDateStart from '@/helpers/sort-by-date-start'
import Languages from '@/helpers/iso_639_languages.js'

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
          const attributes = {
            active: !this.entry.active
          }
          this.Resource.updateAttributes(this.entry, attributes).then(attributes => {
            if (attributes) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.activated(attributes.active)
              })
            }
          })
        }
      })
    },
    /*
     * decide whereever to output the inheritaded attribute for the contact object
     */
    showInheritValue (attribute) {
      if (this.entry.inheritance.contact_infos && this.entry.parent_orga && this.entry.parent_orga.contact && this.entry.parent_orga.contact[attribute]) {
        return this.entry.parent_orga.contact[attribute]
      } else {
        return false
      }
    },
    /*
     * Stringify spoken languages depending on current UI langugage
     */
    stringifySpokenLanguages (spokenLanguages) {
      const languageKey = this.$i18n.locale
      let spokenLanguagesResult = []
      if (spokenLanguages && spokenLanguages.split(',')) {
        const langCodes = spokenLanguages.split(',')
        for (let langCode of langCodes) {
          const langObject = Languages.getLanguageFromCode(langCode)
          spokenLanguagesResult.push(langObject[languageKey])
        }
      }
      return spokenLanguagesResult.join(', ')
    },
    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab
    },
    goBack () {
      this.$router.go(-1)
    }
  },

  computed: {
    mapCenter () {
      if (this.entry.location && this.entry.location.lat) {
        return [this.entry.location.lat, this.entry.location.lon]
      } else {
        return [51.0571904, 13.7154319]
      }
    },
    previewLink () {
      if (this.entry.type === 'orgas') {
        return `${process.env.FRONTEND_URL}project/${this.entry.id}`
      } else if (this.entry.type === 'events') {
        return `${process.env.FRONTEND_URL}event/${this.entry.id}`
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
    AnnotationTag
  }
}
</script>

<style lang="scss" scoped>
@import "~variables";

.go-back {
  color: white;
  margin-left: -6px;
  font-weight: bold;
  width: 28px;
}
.inheritedValue {
  padding-left: 1em;
  border-left: 3px solid $turquoise;
  font-style: italic;
}

.entryDetail {
  margin: 0;
  margin-bottom: 3em;
  padding: 0;
  h2 {
    margin-top: 2em;
    font-size: 1.4em;
    font-weight: 500;
  }

  li.align-status-items {
    margin-left: 4.5em;
  }
  .entryDetail__error {
    margin-bottom: 1em;
  }

  &__meta {
    color: $gray50;
    margin-right: 0.4em;
    /*@todo: better solution: #138*/
    text-transform: capitalize;
  }
  &__meta:after {
    content: ':';
  }
  &__inlineInput {
    flex-grow: 2;
    width: auto;
  }
  &__error {
    color: $red;
  }
  &__error_white_space {
    margin-bottom: 3em;
  }
}
</style>
