<template>
  <div>
    <div class="inputField__spacing" v-if="location">
      <div class="input-field">
        <label for="placename" :class="{active: (location.placename)}">Ortsbezeichnung (z.B. Hinterhof)</label>
        <input  v-model="location.placename" id="placename" type="text" />
      </div>

      <div class="input-field">
        <label for="street" :class="{active: location.street}">Straße</label>
        <input v-model="location.street" id="street" type="text" @change="getGeocode(true)" />
      </div>

      <div class="input-field">
        <label for="zip" :class="{active: location.zip}">Postleitzahl</label>
        <input v-model="location.zip" id="zip" type="text" @change="getGeocode(true)" />
      </div>

      <div class="input-field">
        <label for="city" :class="{active: location.city}">Stadt</label>
        <input v-model="location.city" id="city" type="text" @change="getGeocode(true)" />
      </div>

      <div class="input-field">
        <div v-if="geodataLoading">
          <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Geodaten
        </div>
        <span v-else-if="geocodeError" class="geodata-not-found validation-error">
          {{ geocodeError }}
        </span>
        <span v-if="bippelMoved" class="validation-hint">
          <i class="material-icons">error_outline</i>
          Der Bippel wurde manuell verschoben und zeigt nicht mehr genau auf die Adresse.<br />
          Falls das nicht beabsichtigt ist: <a href="" @click.prevent="resetToGeodateOfAddress">Zurücksetzen auf Adresse.</a>
        </span>
      </div>

      <location-map :map-center="mapCenter" :location="location" :draggable="true" @bibbelDrag="bibbelDrag" :currentTab="currentTab"></location-map>

      <div class="inputField__spacing input-field">
        <label for="directions" :class="{active: location.directions}">
          {{ $t('entries.directions') }}
        </label>
        <textarea v-model="location.directions" id="directions"
          class="materialize-textarea" v-autosize></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { BASE } from '@/store/api'
import Vue from 'vue'
import LocationMap from '@/components/Map'
import Spinner from '@/components/Spinner'

export default {
  props: ['location', 'currentTab'],

  data () {
    return {
      geodataLoading: false,
      geodataOfAddress: null,
      geocodeError: false
    }
  },

  methods: {
    bibbelDrag (markerEvent) {
      this.location.lat = '' + markerEvent.target._latlng.lat
      this.location.lon = '' + markerEvent.target._latlng.lng
    },

    resetToGeodateOfAddress () {
      this.location.lat = this.geodataOfAddress.lat
      this.location.lon = this.geodataOfAddress.lon
    },

    getGeocode (updateItemLocation) {
      const address = [this.location.zip || '', this.location.city || '', this.location.street || ''].join(' ')
      if (address === '  ') {
        this.geocodeError = false
        this.location.lat = null
        this.location.lon = null
        this.geodataOfAddress = null
        return
      }

      this.geodataLoading = true

      let url = BASE + 'geocoding'
      setTimeout(() => {
        let request = Vue.http.get(url, {params: {token: 'MapCat_050615', address}})
        request.then(result => {
          this.geocodeError = false
          this.geodataOfAddress = {
            lat: '' + result.body.latitude,
            lon: '' + result.body.longitude
          }
          if (updateItemLocation) {
            this.location.lat = '' + result.body.latitude
            this.location.lon = '' + result.body.longitude
          }
        }).catch(error => {
          this.geocodeError = 'Geodaten nicht gefunden. Bitte Adresse anpassen.'
          this.geodataOfAddress = null
          if (updateItemLocation) { // do not set intial lat/lon to null in order to prevent the unsaved changes dialog to appear
            this.location.lat = null
            this.location.lon = null
          }
          console.log('error loading geodata', error)
        }).finally(() => {
          this.geodataLoading = false
        })
      }, 200)
    }
  },

  computed: {
    bippelMoved () {
      if (!this.location || !this.geodataOfAddress) {
        return false
      }
      return this.location.lat !== this.geodataOfAddress.lat ||
        this.location.lon !== this.geodataOfAddress.lon
    },

    mapCenter () {
      if (this.location && this.location.lat) {
        return [this.location.lat, this.location.lon]
      } else {
        return [51.0571904, 13.7154319]
      }
    }
  },

  mounted () {
    if (!this.location.isEmpty()) {
      this.getGeocode(false)
    }
  },

  components: {
    LocationMap,
    Spinner
  }
}
</script>
