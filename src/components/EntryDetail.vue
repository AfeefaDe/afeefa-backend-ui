<template>
<div class="row">

  <div class="col s12 m12">
    <div class="mainCard" v-if="entry">
      <div class="mainCard__header mainCard__headerLight">
        <h2 class="mainCard__headerTitle">{{ entry.title }}</h2>
        <router-link :to="{name: routeName + '.edit', params: {id: entry.id}}" class="mainCard__headerAction">
          <i class="material-icons">mode_edit</i>
        </router-link>
      </div>

      <div>
        <ul class="entryDetail">
          <li>
            <span class="entryDetail__meta">{{ $t('entries.description') }}</span>
            <span>{{ entry.description }}</span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.created_at') }}:</span>
            <span>{{ entry.created_at | formatDateAbsolute }} ({{ entry.created_at | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.updated_at') }}:</span>
            <span>{{ entry.updated_at | formatDateAbsolute }} ({{ entry.updated_at | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.state_changed_at') }}:</span>
            <span>{{ entry.state_changed_at | formatDateAbsolute }} ({{ entry.state_changed_at | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.category') }}:</span>
            <span>{{ entry.category ? entry.category.title : 'Keine Kategorie angegeben' }}</span>
          </li>
          <li>
            <span class="entryDetail__meta">{{ $t('entries.sub_category') }}:</span>
            <span>{{ entry.sub_category ? entry.sub_category.title : 'Keine Unterkategorie angegeben' }}</span>
          </li>
        </ul>
        <ul class="entryDetail" v-if="has.date">
          <li>
            <span class="entryDetail__meta"> {{ $t('entries.date_start') }}:</span>
            <span> {{ entry.date_start | formatDateAbsolute }} ({{entry.date_start | formatDateRelative }}) </span>
          </li>
          <li>
            <span class="entryDetail__meta"> {{ $t('entries.date_end') }}: </span>
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
            <span class="entryDetail__meta">{{ $t('entries.placename') }}:</span>
            <span>{{ entry.location.placename }}</span>
          </li>
          <li v-if="entry.location.city">
            <span class="entryDetail__meta">{{ $t('entries.city') }}:</span>
            <span>{{ entry.location.zip }}, {{ entry.location.city }}</span>
          </li>
          <li v-if="entry.location.street">
            <span class="entryDetail__meta">{{ $t('entries.street') }}:</span>
            <span>{{ entry.location.street }}</span>
          </li>
          <li>
            <div class="map">
              <v-map :zoom="mapCenter.zoom" :center="mapCenter.center">
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker :lat-lng="{lat:entry.location.lat, lng:entry.location.lon}" v-if="entry.location.lat"></v-marker>
              </v-map>
            </div>
          </li>
        </ul>

        <ul class="entryDetail" v-if="entry.contact">
          <h2>{{ $t('headlines.contact') }}</h2>
          <li v-if="entry.contact.person">
            <span class="entryDetail__meta">{{ $t('entries.person') }}:</span>
            <span>{{ entry.contact.person }}</span>
          </li>
          <li v-if="entry.contact.mail">
            <span class="entryDetail__meta">{{ $t('entries.mail') }}:</span>
            <span><a :href="'mailto:' + entry.contact.mail">{{ entry.contact.mail }}</a></span>
          </li>
          <li v-if="entry.contact.phone">
            <span class="entryDetail__meta">{{ $t('entries.phone') }}:</span>
            <span>{{ entry.contact.phone }}</span>
          </li>
        </ul>

        <div class="entryDetail">
          <h2>{{ $tc('headlines.annotations', entry.annotations.length) }}</h2>
          <div v-if="entry.annotations.length">
            <p class="annotationTag"
              title="Durch das Bearbeiten des Eintrags können Anmerkungen entfernt und hinzugefügt werden."
              v-for="annotation in entry.annotations">
              {{ annotation.title }}
            </p>
          </div>
          <div v-else>
            Keine Todos vorhanden.
          </div>
        </div>

        <div class="entryDetail">
          <h2>{{ $t('headlines.status') }}: {{ entry.active ? '' : 'nicht' }} aktiviert</h2>
          <div class="nowrap">
            <button @click="togglePublishState" :class="['btn', 'publishButton', 'waves-effect', {red: entry.active}]" type="submit">
              {{ entry.active ? 'Deaktivieren' : 'Aktivieren' }}
            </button>
          </div>
        </div>

        <div class="entryDetail" v-if="has.parentOrga">
          <h2>Übergeordnete Orga</h2>
          <entry-list-items :items="[entry.parent_orga]" v-if="entry.parent_orga"></entry-list-items>
          <div v-else>
            Es exisitert keine übergeordnete Orga.
          </div>

          <h2>Untergeordnete Orgas</h2>
          <entry-list-items :items="entry.sub_orgas" v-if="entry.sub_orgas.length"></entry-list-items>
          <div v-else>
           Es existieren keine untergeordneten Orgas.
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
import Vue2Leaflet from 'vue2-leaflet'

export default {
  props: ['entry', 'routeName', 'Resource', 'messages', 'options'],

  data () {
    const options = this.options || {}
    return {
      has: {
        date: options.hasDate,
        parentOrga: options.hasParentOrga,
        orga: options.hasOrga
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
    }
  },

  computed: {
    mapCenter () {
      if (this.entry.location && this.entry.location.lat) {
        return {
          zoom: 17,
          center: [this.entry.location.lat, this.entry.location.lon]
        }
      } else {
        return {
          zoom: 10,
          center: [51.0571904, 13.7154319]
        }
      }
    }
  },

  components: {
    EntryListItems,
    VMap: Vue2Leaflet.Map,
    VTilelayer: Vue2Leaflet.TileLayer,
    VMarker: Vue2Leaflet.Marker
  }
}
</script>



<style lang="scss" scoped>
.map {
  margin-top: 1em;
  width: 300px;
  height: 300px;
}
</style>
