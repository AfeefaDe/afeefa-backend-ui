<template>
  <div :class="['map', {active: mapActive}]" @mousedown="activateMap">
    <v-map ref="map" :zoom="zoom" :center="center" @l-ready="mapLoad()" @l-blur="mapLeave" @l-dblclick="autoZoom" @l-dragend="mapDragEnd">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
      <v-marker :lat-lng="marker" :draggable="draggable"
        @l-mousedown="bibbleDown"
        @l-dragend="bibbleDragEnd"
        @l-click="bibbleUp"
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
      isBibbleDrag: false
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
          // zoomed in and nearer than 50 meters -> zoom out
          if (map.getZoom() >= 18 && currentDistance < 50) {
            this.zoom = 11
          }
          // zoomed out and nearer than 1000 meters -> zoom in
          if (map.getZoom() < 18 && currentDistance < 1000) {
            this.zoom = 18
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

    mapLeave (event) {
      if (this.isBibbleDrag) {
        return
      }
      this.deactivateMap()
    },

    mapDragEnd (event) {
      this.bibbleUp()
    },

    bibbleDown () {
      this.isBibbleDrag = true
      this.activateMap()
    },

    bibbleDragEnd (event) {
      this.$emit('bibbelDrag', event)
      this.bibbleUp()
    },

    bibbleUp () {
      this.isBibbleDrag = false
      this.activateMap()
      const mapDom = this.$refs.map.$el
      mapDom.focus()
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
  padding: 1px;
  height: 300px;

  &.active {
    border: 1px solid #26a69a;
    padding: 0;
  }
}
</style>
