<template>
  <div>
    <div class="col s12 m12">
      <div class="mainCard" v-if="facet">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Facette ändern</h2>
        </div>

        <input type="text" v-model="facet.title" @keyup.enter="updateFacet">
        <button class="btn waves-effect waves-light saveButton" type="submit" @click="updateFacet">
          <i class="material-icons left">done</i>
          Ändern
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      origFacet: null,
      facet: null
    }
  },

  created () {
    Facet.get(this.id).then(facet => {
      this.origFacet = facet
      this.facet = facet.clone()
    })
  },

  methods: {
    /*
     * called by the BeforeRouteLeaveMixin
     * to raise a alert in case of unsaved changes
     */
    $canLeaveRoute () {
      if (!this.facet) { // loading error
        return true
      }
      const hashOrig = JSON.stringify(this.origFacet.serialize())
      const hashItem = JSON.stringify(this.facet.serialize())

      if (hashOrig === hashItem) {
        return true
      }
      return 'Soll das Editieren beendet werden?'
    },

    updateFacet () {
      Facet.save(this.facet).then(facet => {
        if (facet) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde geändert.'
          })
          this.$router.push({name: 'facets.list'})
        }
      })
    }
  }
}
</script>

<style>
ul {
  padding-left: 20px;
}
li {
  list-style-type: circle;
}
</style>
