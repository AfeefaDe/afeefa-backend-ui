<template>
  <div class="editableActors">

    <modal ref="modal" class="modalWindow" :hasClose="false">
      <div class="modalContent">
        <div class="actorSelector">
          <selectable-list
            :title="title"
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

            <div class="noSelectedItems" slot="noSelectedItems">
              Keine {{ title }} ausgewählt.
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
import ActorSelectorMixin from './mixins/ActorSelectorMixin'
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'

export default {
  mixins: [ActorSelectorMixin],

  props: ['title'],

  data () {
    return {
      isReloading: 0,

      messagesSelectable: {
        loading: 'Lade Akteure',
        title: 'Alle',
        notFound: 'Nichts gefunden'
      }
    }
  },

  computed: {
    items () {
      return this.actor[this.relationName]
    },

    editLinkTitle () {
      return this.selectedActors.length ? 'Ändern' : 'Hinzufügen'
    }
  },

  methods: {
    editLinkClick (triggerButton) {
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

    actorRelationSaved (actor) {
      if (this.actor.id) {
        this.isReloading = 1

        // show loading spinner min 500 ms for good ux
        setTimeout(() => {
          this.isReloading++
          this.setItemsAfterLoading()
        }, 200)

        this.reloadActors().then(() => {
          this.isReloading++
          this.setItemsAfterLoading()
        })
      } else { // new items add directly
        this.actor[this.relationName] = this.selectedActors
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

.noSelectedItems {
  margin-bottom: .4em;
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
