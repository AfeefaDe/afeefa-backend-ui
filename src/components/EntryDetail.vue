<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="entry">
      <div class="mainCard__header mainCard__headerLight">
        <a href="" @click.prevent="goBack"><i class="material-icons go-back">chevron_left</i></a>
        <h2 class="mainCard__headerTitle">{{ entry.title || 'Kein Titel' }}</h2>
        <router-link :to="{name: routeName + '.edit', params: {id: entry.id}}" class="mainCard__headerAction">
          <i class="material-icons">mode_edit</i>
        </router-link>
      </div>

      <image-container
        :image-url="entry.media_url">
      </image-container>

      <div>
        <ul class="entryDetail">
          <li class="multiLineProperty">
            <span class="entryDetail__meta">{{ $t('entries.description') }}</span>
            <span class="multiLineProperty__content">{{ entry.description }}</span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.created_at') }}</span>
            <span>{{ entry.created_at | formatDateAbsolute }} ({{ entry.created_at | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.updated_at') }}</span>
            <span>{{ entry.updated_at | formatDateAbsolute }} ({{ entry.updated_at | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.state_changed_at') }}</span>
            <span>{{ entry.state_changed_at | formatDateAbsolute }} ({{ entry.state_changed_at | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.category') }}</span>
            <span>{{ entry.category ? $t('categories.' + entry.category.title) : $t('infos.no_category') }}</span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.sub_category') }}</span>
            <span>{{ entry.sub_category ? $t('categories.' + entry.sub_category.title) : $t('infos.no_subcategory') }}</span>
          </li>
        </ul>
        <ul class="entryDetail" v-if="has.date">
          <li>
            <span class="entryDetail__meta"> {{ $t('entries.date_start') }}</span>
            <span> {{ entry.date_start | formatDateAbsolute }} ({{entry.date_start | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta"> {{ $t('entries.date_end') }}</span>
            <span> {{ entry.date_end | formatDateAbsolute }} ({{entry.date_end | formatDateRelative }}) </span>
          </li>
        </ul>

        <div class="entryDetail" v-if="has.orga">
          <h2>Veranstalter</h2>
          <entry-list-items :items="[entry.parent_orga]" v-if="entry.parent_orga"></entry-list-items>
          <div v-else>
            Kein Veranstalter angegeben.
          </div>
        </div>

        <ul class="entryDetail" v-if="entry.location">
          <h2>{{ $t('headlines.location') }}</h2>
          <li v-if="entry.location.placename">
            <span class="entryDetail__meta">{{ $t('entries.placename') }}</span>
            <span>{{ entry.location.placename }}</span>
          </li>
          <li v-if="entry.location.street">
            <span class="entryDetail__meta">{{ $t('entries.street') }}</span>
            <span>{{ entry.location.street }}</span>
          </li>
          <li v-if="entry.location.zip || entry.location.city">
            <span class="entryDetail__meta">{{ $t('entries.city') }}</span>
            <span>{{ entry.location.zip }} {{ entry.location.city }}</span>
          </li>
          <li v-if="!entry.location.isEmpty()">
            <location-map :map-center="mapCenter" :location="entry.location"></location-map>
          </li>
          <li v-if="entry.location.directions" class="multiLineProperty">
            <span class="entryDetail__meta">{{ $t('entries.directions') }}</span>
            <span class="multiLineProperty__content">{{ entry.location.directions }}</span>
          </li>
          <li v-if="entry.location.isEmpty()" class="entryDetail__error">
            {{ $t('errors.noLocationPresent') }}
          </li>
        </ul>

        <ul class="entryDetail" v-if="entry.contact">
          <h2>{{ $t('headlines.contact') }}</h2>
          <li v-if="entry.contact.person">
            <span class="entryDetail__meta">{{ $t('entries.person') }}</span>
            <span>{{ entry.contact.person }}</span>
          </li>
          <li v-if="entry.contact.mail">
            <span class="entryDetail__meta">{{ $t('entries.mail') }}</span>
            <span><a :href="'mailto:' + entry.contact.mail">{{ entry.contact.mail }}</a></span>
          </li>
          <li v-if="entry.contact.phone">
            <span class="entryDetail__meta">{{ $t('entries.phone') }}</span>
            <span>{{ entry.contact.phone }}</span>
          </li>
          <li v-if="entry.contact.openingHours" class="multiLineProperty">
            <span class="entryDetail__meta">{{ $t('entries.openingHours') }}</span>
            <span class="multiLineProperty__content">{{ entry.contact.openingHours }}</span>
          </li>
          <li v-if="entry.contact.web">
            <span class="entryDetail__meta">{{ $t('entries.web') }}</span>
            <a :href="entry.contact.web" target="_blank">{{ entry.contact.web }}</a>
          </li>
          <li v-if="entry.contact.facebook">
            <span class="entryDetail__meta">{{ $t('entries.facebook') }}</span>
            <a :href="entry.contact.facebook" target="_blank">{{ entry.contact.facebook }}</a>
          </li>
          <li v-if="entry.contact.isEmpty()" class="entryDetail__error">
            {{ $t('errors.noContactPresent') }}
          </li>
        </ul>

        <div class="entryDetail">
          <h2>{{ $tc('headlines.annotations', entry.annotations.length) }}</h2>
          <div v-if="entry.annotations.length">
            <p class="annotationTag"
              :title="$t('hints.edit_annotations')"
              v-for="annotation in entry.annotations">
              {{ annotation.title }}
            </p>
          </div>
          <div v-else class="entryDetail__error">
            {{ $t('errors.noAnnotationPresent') }}
          </div>
        </div>

        <div class="entryDetail">
          <h2>{{ $t('headlines.status') }}: {{ entry.active ? '' : 'nicht' }} aktiviert</h2>
          <div class="nowrap">
            <button @click="togglePublishState" :class="['btn', 'publishButton', 'waves-effect', {red: entry.active}]" type="submit">
              {{ entry.active ? $t('buttons.deactivate') : $t('buttons.activate') }}
            </button>
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

      </div>

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
    ImageContainer
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/_variables.scss";

.go-back {
  color: #039be5;
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
  li {
    list-style: none;
    display: block;
    margin-bottom: 0.6em;
    align-items: baseline;
  }
  li.multiLineProperty {
    display: flex;
    .multiLineProperty__content {
      white-space: pre-wrap;
    }
  }
  li.nowrap {
    display: block;
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
.image-container-style {
  background-color: $white;
}
.image-container {
  background-repeat: no-repeat;
  background-position: center left;
  background-size: contain;
  height: 9rem;
}
</style>
