<template>
  <div>
    <div v-if="isLoading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade {{ title }}
    </div>
    <div v-else>
      <div v-for="actor in items" :key="actor.id">
        <slot name="actor" :actor="actor" />
      </div>
      <div v-if="!owner[this.relationName].length" class="entryDetail__error">Keine {{ title }} angegeben</div>

      <component :is="selector" :actor="owner" :relationName="relationName" title="Ändern" @saved="actorRelationSaved" />
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import ActorSelector from '@/components/selector/ActorSelector'

export default {
  props: ['owner', 'relationName', 'title'],

  data () {
    return {
      items: [],
      isLoading: 0,
      selector: ActorSelector
    }
  },

  created () {
    this.items = this.owner[this.relationName]
  },

  methods: {
    actorRelationSaved () {
      this.isLoading = 1

      // show loading spinner min 500 ms for good ux
      setTimeout(() => {
        this.isLoading++
        this.setItemsAfterLoading()
      }, 500)

      this.reloadActors().then(() => {
        this.isLoading++
        this.setItemsAfterLoading()
      })
    },

    setItemsAfterLoading () {
      if (this.isLoading > 2) {
        this.isLoading = false
        this.items = this.owner[this.relationName]
      }
    },

    reloadActors () {
      return this.owner.$rels.actor_relations.refetch()
    }
  },

  components: {
    Spinner
  }
}
</script>
