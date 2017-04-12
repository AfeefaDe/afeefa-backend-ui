<template>
  <div :class="['map', {active: mapActive}]" @mousedown="activateMap">
    <v-map ref="map" :zoom="zoom" :center="center" @l-ready="mapLoad()" @l-blur="mapLeave" @l-dblclick="autoZoom">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
      <v-marker :lat-lng="marker" :draggable="draggable"
        @l-mousedown="markerDown"
        @l-dragend="dragEnd"
        @l-click="markerUp"
        v-if="marker"></v-marker>
    </v-map>
  </div>
</template>


<script>
import Vue2Leaflet from 'vue2-leaflet'

export default {
  props: ['mapCenter', 'location', 'draggable'],

  data () {
    return {
      center: null,
      zoom: null,
      marker: null,
      mapActive: false,
      isDrag: false
    }
  },

  watch: {
    'location.lat' (lat) {
      this.resetCenter()
      this.setMarker()
    }
  },

  created () {
    this.resetCenter()
    this.setMarker()
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
      if (this.location.lat) {
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
      } else {
        this.zoom = 11
      }
    },

    setMarker () {
      if (this.location.lat) {
        this.marker = {
          lat: this.location.lat,
          lng: this.location.lon
        }
        this.zoom = 18
      } else {
        this.marker = null
        this.zoom = 11
      }
    },

    autoZoom () {
      this.resetCenter()
    },

    mapLoad () {
      const map = this.$refs.map.mapObject
      map.scrollWheelZoom.disable()
      map.doubleClickZoom.disable()
    },

    markerDown () {
      this.isDrag = true
      this.activateMap()
    },

    dragEnd (event) {
      this.$emit('bibbelDrag', event)
      this.markerUp()
    },

    markerUp () {
      this.isDrag = false
      const map = this.$refs.map.$el
      this.activateMap()
      map.focus()
    },

    mapLeave (event) {
      if (this.isDrag) {
        return
      }
      this.deactivateMap()
    },

    activateMap () {
      const map = this.$refs.map.mapObject
      map.scrollWheelZoom.enable()
      this.mapActive = true
    },

    deactivateMap () {
      const map = this.$refs.map.mapObject
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
