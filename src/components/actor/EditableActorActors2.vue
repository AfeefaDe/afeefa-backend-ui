<template>
  <div>
    <div v-if="isLoading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade {{ title }}
    </div>
    <div v-else>
      <div v-if="showActors">
        <div v-for="actor in items" :key="actor.id">
          <router-link v-if="!isEdit" :to="{name: 'orgas.show', params: {id: actor.id}}">
            {{ actor.title }}
          </router-link>
          <span v-else>
            {{ actor.title }}
            <div class="removeIcon">
              <i class="material-icons">cancel</i>
            </div>
          </span>

        </div>
        <div v-if="!items.length" class="entryDetail__error">Keine {{ title }} angegeben</div>
      </div>

      <component v-if="isEdit" :is="selector" :actor="owner" :relationName="relationName" title="Hinzufügen" @saved="actorRelationSaved">
        <slot slot="triggerButton" name="triggerButton" />
      </component>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import SingleActorSelector from '@/components/actor/SingleActorSelector'

export default {
  props: ['owner', 'relationName', 'title', 'showActors', 'isEdit'],

  data () {
    return {
      isLoading: 0,
      selector: SingleActorSelector
    }
  },

  computed: {
    items () {
      return this.owner[this.relationName]
    }
  },

  watch: {
    isEdit () {
      // just watch
    }
  },

  methods: {
    actorRelationSaved (actors) {
      if (this.owner.id) {
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
      } else { // new items add directly
        this.owner[this.relationName] = actors
        this.isLoading = 3
        this.setItemsAfterLoading()
      }
    },

    setItemsAfterLoading () {
      if (this.isLoading > 2) {
        this.isLoading = false
      }
    },

    reloadActors () {
      return this.owner.$rels[this.relationName].refetch()
    }
  },

  components: {
    Spinner
  }
}
</script>

<style lang="scss" scoped>
.removeIcon {
  display: inline;
  i {
    font-size: 1.1em;
    margin-left: .1em;
    color: $gray80;
  }
}
</style>
