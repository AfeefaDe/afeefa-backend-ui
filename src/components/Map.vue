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
    resetCenter () {
      this.center = this.mapCenter.center.concat()
      if (this.$refs.map) {
        const map = this.$refs.map.mapObject
        this.zoom = map.getZoom() === 20 ? this.mapCenter.zoom : 20
      } else {
        this.zoom = 20
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
