<template>
  <div>
    <div v-if="isLoading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade {{ title }}
    </div>
    <div v-else>
      <div v-if="showActors">
        <div v-for="actor in items" :key="actor.id" class="actor">
          <div class="actorIcon" v-if="false">
            <i class="material-icons">group</i>
          </div>
          <div class="actorTitle">
            <router-link v-if="!isEdit" :to="{name: 'orgas.show', params: {id: actor.id}}">
              {{ actor.title }}
            </router-link>
            <span v-else>
              <a href="" @click.prevent="removeActor(actor)">{{ actor.title }}</a>
              <div class="removeIcon" @click="removeActor(actor)">
                <i class="material-icons">cancel</i>
              </div>
            </span>
         </div>

        </div>
        <div v-if="!items.length" class="entryDetail__error">Keine {{ title }} angegeben</div>
      </div>

      <component v-if="isEdit && owner[relationName].length < 3" :is="selector" :actor="owner" :relationName="relationName" title="Hinzufügen" @added="actorRelationAdded">
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
    actorRelationAdded (actor) {
      this.actorRelationSaved(actor, 'add')
    },

    actorRelationSaved (actor, operation) {
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
        if (operation === 'add') {
          this.owner[this.relationName].push(actor)
        } else {
          this.owner[this.relationName] = this.owner[this.relationName].filter(a => a !== actor)
        }
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
    },

    removeActor (actor) {
      this.$store.dispatch('messages/showDialog', {
        title: 'Akteur entfernen',
        message: `Soll der Akteur "${actor.title}" aus der Liste entfernt werden?`
      }).then(result => {
        if (result === 'yes') {
          return this.owner.$rels[this.relationName].Query.detach(actor).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Der Akteur wurde entfernt.'
              })
              this.actorRelationSaved(actor, 'del')
            }
          })
        }
      })
    }
  },

  components: {
    Spinner
  }
}
</script>

<style lang="scss" scoped>
.actor {
  display: flex;
  &:not(:last-child) {
    margin-bottom: .5em;
  }
}

.actorIcon {
  flex: 0 0 24px;
  i {
    font-size: 14px;
  }
}

.removeIcon {
  cursor: pointer;
  display: inline;
  i {
    font-size: 1.1em;
    margin-left: .1em;
    color: $gray80;
  }
}
</style>
