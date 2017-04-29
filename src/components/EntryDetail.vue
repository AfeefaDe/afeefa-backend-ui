<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="entry">
      <div class="mainCard__header mainCard__headerGreen">
        <a href="" @click.prevent="goBack"><i class="material-icons go-back">chevron_left</i></a>
        <div class="mainCard__headerTitleContainer">
          <h2 class="mainCard__headerTitle">{{ entry.title || 'Kein Titel' }}</h2>
          <span v-if="entry.parent_orga" class="mainCard__headerSubtitle">
            {{ has.date ? $t('headlines.organizer') : $t('headlines.parentOrga') }}:
            <router-link :to="{name: entry.parent_orga.type + '.show', params: {id: entry.parent_orga.id}}">
              <u> {{ entry.parent_orga.title }}</u>
            </router-link>
          </span>
        </div>
        <router-link :to="{name: routeName + '.edit', params: {id: entry.id}}" class="mainCard__headerButton">
          Bearbeiten
          <i class="material-icons">mode_edit</i>
        </router-link>
      </div>

      <image-container
        :image-url="entry.media_url">
      </image-container>

      <entry-detail-tabbed-content>
        <section slot="generalPane">
          <ul class="entryDetail">
            <entry-detail-property :name="$t('entries.title')" hasEntryIcon="true" :entryIconType='entry.type' :entryIconStatus='entry.active' >
              {{ entry.title }}
            </entry-detail-property>

            <entry-detail-property :name="$t('entries.description')" :iconName="'more_horiz'" :isMultiline="true">{{ entry.description }}</entry-detail-property>

            <entry-detail-property :name="$t('entries.category')" :iconName="'bookmark_border'">
              {{ entry.category ? entry.category.title : 'Keine Kategorie angegeben' }} >
              {{ entry.sub_category ? entry.sub_category.title : 'Keine Unterkategorie angegeben' }}
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('entries.date')"
              :iconName="'date_range'"
              v-if="has.date">
                <span v-if="entry.date_start"> {{ $t('entries.date_start') }}: {{ entry.date_start | formatDateAbsolute }} ({{entry.date_start | formatDateRelative }})<br></span>
                <span v-if="entry.date_end">
                {{ $t('entries.date_end') }}: {{ entry.date_end | formatDateAbsolute }} ({{entry.date_end | formatDateRelative }})<br>
                </span>
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('headlines.annotations', entry.annotations.length)"
              :iconName="'label_outline'">
              <div v-if="entry.annotations.length">
                <p class="annotationTag"
                  :title= "$t('hints.edit_annotations')"
                  v-for="annotation in entry.annotations">
                   {{annotation.annotationCategory.title}}
                   <span v-if="annotation.detail" class="annotation-detail"><br> {{annotation.detail}} </span>
                </p>
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
              </button><br>
              <span>{{ $t('entries.created_at') }}: {{ entry.created_at | formatDateAbsolute }} ({{ entry.created_at | formatDateRelative }})</span><br>
              <span>{{ $t('entries.updated_at') }}: {{ entry.updated_at | formatDateAbsolute }} ({{ entry.updated_at | formatDateRelative }})</span><br>
              <span>{{ $t('entries.state_changed_at') }}: {{ entry.state_changed_at | formatDateAbsolute }} ({{ entry.state_changed_at | formatDateRelative }})</span><br>
            </entry-detail-property>
          </ul>
        </section>

        <section slot="placePane">
          <ul class="entryDetail" v-if="entry.location">
            <li v-if="entry.location.isEmpty()" class="entryDetail__error">
              {{ $t('errors.noLocationPresent') }}
            </li>
            <li v-else>
              <entry-detail-property :name="$t('entries.address')" :iconName="'location_on'">
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

        <section slot="contactPane">
          <ul class="entryDetail" v-if="entry.contact">
            <li v-if="entry.contact.isEmpty()" class="entryDetail__error">
              {{ $t('errors.noContactPresent') }}
            </li>
            <li v-else>
              <entry-detail-property :name="$t('headlines.contact')" :iconName="'mail_outline'" v-if="entry.contact.person || entry.contact.phone || entry.contact.mail">
                  <span v-if="entry.contact.person">{{ entry.contact.person }}<br></span>
                  <span v-if="entry.contact.phone">{{ entry.contact.phone }}<br></span>
                  <a v-if="entry.contact.mail" :href="'mailto:' + entry.contact.mail">{{ entry.contact.mail }}</a>
              </entry-detail-property>

              <entry-detail-property v-if="entry.contact.openingHours" :name="$t('entries.openingHours')" :iconName="'access_time'" :isMultiline="true">{{ entry.contact.openingHours }}</entry-detail-property>

              <entry-detail-property :name="'Links'" :iconName="'link'" v-if="entry.contact.web || entry.contact.facebook">
                <span v-if="entry.contact.web"><a :href="entry.contact.web" target="_blank">{{ entry.contact.web }}</a><br></span>
                <span v-if="entry.contact.facebook"><a :href="entry.contact.facebook" target="_blank">{{ entry.contact.facebook }}</a></span>
              </entry-detail-property>
            </li>
          </ul>
        </section>

        <section slot="linkPane">
          @todo: enter links pane
          <div class="entryDetail" v-if="has.orga">
            <h2>Veranstalter</h2>
            <entry-list-items :items="[entry.parent_orga]" v-if="entry.parent_orga"></entry-list-items>
            <div v-else>
              Kein Veranstalter angegeben.
            </div>
          </div>

          <div class="entryDetail" v-if="has.events">
            <h2>Veranstaltungen der Orga</h2>
            <form>
              <fieldset>
                <input type="radio" id="up" v-model="filterOrgaEventsBy" value="upcoming" v-on:change="updateEventFilter">
                <label for="up"> Aktuelle Veranstaltungen</label><br>
                <input type="radio" id="pa" v-model="filterOrgaEventsBy" value="past" v-on:change="updateEventFilter">
                <label for="pa"> Vergangene Veranstaltungen</label>
              </fieldset>
            </form>
            <entry-list-items
              :items="events"
              v-if="events.length"
              :sort-function="sortByDateStart"
              :sort-order="orgaEventsSortOrder"
              :options="{date_start: true}">
            </entry-list-items>
            <div v-else class="entryDetail__error">
              {{ $t('errors.noEventsForOrga') }}
            </div>
          </div>

          <div class="entryDetail" v-if="has.parentOrga">
            <h2>{{ $t('headlines.parentOrga') }}</h2>
            <entry-list-items :items="[entry.parent_orga]" v-if="entry.parent_orga"></entry-list-items>
            <div v-else class="entryDetail__error">
              {{ $t('errors.noParentOrgaPresent') }}
            </div>

            <h2>{{ $t('headlines.subOrgas') }}</h2>
            <entry-list-items :items="entry.sub_orgas" v-if="entry.sub_orgas.length"></entry-list-items>
            <div v-else class="entryDetail__error">
              {{ $t('errors.noSubOrgaPresent') }}
            </div>
          </div>
        </section>
      </entry-detail-tabbed-content>
    </div>

    <div v-else class="mainCard">
      <div class="mainCard__header mainCard__headerLight">
        {{ messages.loading() }} ...
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
import EntryDetailTabbedContent from '@/components/EntryDetailTabbedContent'
import Events from '@/resources/Events'
import sortByDateStart from '@/helpers/sort-by-date-start'

export default {
  props: ['entry', 'routeName', 'Resource', 'messages', 'options'],

  data () {
    const options = this.options || {}
    return {
      events: [],
      filterOrgaEventsBy: 'upcoming',
      orgaEventsSortOrder: 'ASC',
      sortByDateStart,
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
      this.updateEventFilter()
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
          this.Resource.updateAttributes(this.entry.id, attributes).then(attributes => {
            if (attributes) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.activated(attributes.active)
              })
              this.entry.active = attributes.active
            }
          })
        }
      })
    },

    updateEventFilter () {
      if (this.entry && this.has.events) {
        Events.getAllForOrga(this.entry.id, this.filterOrgaEventsBy).then(events => {
          this.events = events
        })
      }
      if (this.filterOrgaEventsBy === 'upcoming') {
        this.orgaEventsSortOrder = 'ASC'
      } else {
        // this.filterOrgaEventsBy === 'past'
        this.orgaEventsSortOrder = 'DESC'
      }
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
    }
  },

  components: {
    EntryListItems,
    LocationMap,
    ImageContainer,
    EntryDetailProperty,
    EntryDetailTabbedContent
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/_variables.scss";

.go-back {
  color: white;
  margin-left: -6px;
  font-weight: bold;
  width: 28px;
}

.entryDetail {
  margin: 0;
  padding: 0;
  h2 {
    margin-top: 2em;
    font-size: 1.4em;
    font-weight: 500;
  }

  span.annotation-detail {
    color: grey;
    font-size: 12px;
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
}
</style>
