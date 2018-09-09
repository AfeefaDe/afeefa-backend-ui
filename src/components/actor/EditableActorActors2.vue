<template>
  <div>

    <modal ref="modal" class="modalWindow" :hasClose="false">
      <div class="modalContent">
        <div class="actorSelector">
          <selectable-list
            :items="selectableActors"
            :selectedItems="selectedActors"
            :messages="messagesSelectable"
            :isLoading="isLoading"
            :maxSelectableItems="3"
            @select="addActor"
            @cancel="hideModal"
            @save="saveSelectedActors">

            <div slot="item" slot-scope="props" class="selectableItem">
              <entry-icon :item="props.item" />
              <div>{{ props.item.title }}</div>
            </div>

            <div class="selectedItem" slot="selectedItem" slot-scope="props">
              <div class="actorIcon">
                <i class="material-icons">group</i>
              </div>
              <div class="selectedItemTitle" @click.capture.prevent="removeActor(props.item)">
                <span>{{ props.item.title }}</span>
                <i class="material-icons">cancel</i>
              </div>
            </div>

          </selectable-list>
        </div>
      </div>
    </modal>

    <div v-if="isReloading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade {{ title }}
    </div>

    <div v-else>
      <div v-for="actor in initialSelectedActors" :key="actor.id" class="selectedActor">
        <div class="actorTitle">
          <router-link :to="{name: 'orgas.show', params: {id: actor.id}}">
            {{ actor.title }}
          </router-link>
        </div>

      </div>

      <div v-if="!items.length" class="entryDetail__error">Keine {{ title }} angegeben.</div>
    </div>

  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import SingleActorSelector from '@/components/actor/SingleActorSelector'
import ActorSelectorMixin from './mixins/ActorSelectorMixin'
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'

export default {
  mixins: [ActorSelectorMixin],

  props: ['title', 'trigger'],

  data () {
    return {
      isReloading: 0,
      selector: SingleActorSelector,

      messagesSelectable: {
        title: 'Alle',
        notFound: 'Nichts gefunden'
      },
      messagesSelected: {
        title: 'Ausgewählt',
        notFound: 'Nichts ausgewählt'
      }
    }
  },

  created () {
    if (!this.trigger) {
      this.$on('edit', this.onEdit)
    }
  },

  destroyed () {
    if (!this.trigger) {
      this.$off('edit', this.onEdit)
    }
  },

  computed: {
    items () {
      return this.actor[this.relationName]
    }
  },

  methods: {
    onEdit () {
      this.showModal()
    },

    showModal () {
      this.$refs.modal.show()
      this.initSelectedActors()
      this.loadSelectableActors()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    startActorRelationSave () {
      this.hideModal()
    },

    actorRelationSaved (actor, operation) {
      if (this.actor.id) {
        this.isReloading = 1

        // show loading spinner min 500 ms for good ux
        setTimeout(() => {
          this.isReloading++
          this.setItemsAfterLoading()
        }, 500)

        this.reloadActors().then(() => {
          this.isReloading++
          this.setItemsAfterLoading()
        })
      } else { // new items add directly
        if (operation === 'add') {
          this.actor[this.relationName].push(actor)
        } else {
          this.actor[this.relationName] = this.actor[this.relationName].filter(a => a !== actor)
        }
        this.isReloading = 3
        this.setItemsAfterLoading()
      }
    },

    setItemsAfterLoading () {
      if (this.isReloading > 2) {
        this.isReloading = false
        this.initSelectedActors()
      }
    }
  },

  components: {
    Spinner,
    Modal,
    SelectableList
  }
}
</script>

<style lang="scss" scoped>
.modalWindow /deep/ .modal__window {
  width: 600px;
  padding: 2em 1.5em 1.7em;
}

.selectableItem {
  display: flex;
  align-items: center;
  line-height: 2em;
  padding: 0 .5em;

  .entryIcon /deep/ i {
    font-size: 1.1em;
    margin-right: .6em;
  }
}

.selectableList {
  /deep/ .selectableItems, /deep/ .hint {
    height: auto;
  }
}

.selectedActor {
  &:not(:last-child) {
    margin-bottom: .4em;
  }
}

.selectedItem {
  display: flex;
  align-items: center;
}

.actorIcon {
  flex: 0 0 28px;
  i {
    font-size: 14px;
  }
}

.selectedItemTitle {
  cursor: pointer;
  > i {
    display: inline;
    position: relative;
    top: .1em;
    font-size: 1.1em;
    color: $gray50;
  }
  &:hover {
    color: $gray50;
    i {
      color: $gray30;
    }
  }
}

.actorTitle {
  line-height: 1.3;
}

.removeIcon {
  cursor: pointer;
  display: inline;
  i {
    font-size: 1.1em;
    margin-left: .1em;
    color: $gray50;
  }
}
</style>
