<template>
  <div :class="['map', {active: mapActive}]" @mousedown="mapClick">
    <v-map ref="map" :zoom="zoom" :center="center" @l-ready="mapLoad()" @l-blur="mapLeave" @l-dblclick="autoZoom">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
      <v-marker :lat-lng="{lat:location.lat, lng:location.lon}" v-if="location.lat"></v-marker>
    </v-map>
  </div>
</template>


<script>
import Vue2Leaflet from 'vue2-leaflet'

export default {
  props: ['mapCenter', 'location'],

  data () {
    return {
      center: null,
      zoom: null,
      mapActive: false
    }
  },

  created () {
    this.resetCenter()
  },

  methods: {
    currentDistance (map) {
      const earthRadius = 6371
      const currentCenter = map.getCenter()
      const lat = currentCenter.lat - parseFloat(this.mapCenter[0])
      const lng = currentCenter.lng - parseFloat(this.mapCenter[1])
      var disLat = (lat * Math.PI * earthRadius) / 180
      var disLng = (lng * Math.PI * earthRadius) / 180
      var ret = Math.pow(disLat, 2) + Math.pow(disLng, 2)
      return Math.sqrt(ret) * 1000
    },

    resetCenter () {
      this.center = this.mapCenter.concat()
      if (this.$refs.map) {
        const map = this.$refs.map.mapObject
        const currentDistance = this.currentDistance(map)
        // nearer than 50 meters, switch zoom
        if (currentDistance < 50) {
          this.zoom = map.getZoom() >= 18 ? 11 : 18
        }
      } else {
        this.zoom = 18
      }
    },

    autoZoom () {
      this.resetCenter()
    },

    mapClick () {
      const map = this.$refs.map.mapObject
      map.scrollWheelZoom.enable()
      this.mapActive = true
    },

    mapLoad () {
      const map = this.$refs.map.mapObject
      map.scrollWheelZoom.disable()
      map.doubleClickZoom.disable()
    },

    mapLeave (event) {
      const map = event.target
      map.scrollWheelZoom.disable()
      this.mapActive = false
    }
  },

  components: {
    VMap: Vue2Leaflet.Map,
    VTilelayer: Vue2Leaflet.TileLayer,
    VMarker: Vue2Leaflet.Marker
  }
}
</script>


<style lang="scss" scoped>
.map {
  margin-top: 1em;
  height: 300px;

  &.active {
    border: 1px solid #26a69a;
  }
}
</style>
