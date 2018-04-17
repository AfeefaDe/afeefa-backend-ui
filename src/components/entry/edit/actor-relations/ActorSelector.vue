<template>
  <div>
    <modal ref="modal" class="modalWindow">
      <div class="modalContent">
        <div class="ownerInfo">
          {{ actor.title }} <i class="material-icons">chevron_right</i> {{ title }}
        </div>

        <div class="actorSelector">
          <selectable-list
            :items="selectableActors"
            :messages="messagesSelectable"
            :isLoading="isLoading"
            @cancel="hideModal"
            @select="addActor">
            <div slot="item" slot-scope="props" class="listEntry">
              <entry-icon :item="props.item" />
              <div>{{ props.item.title }}</div>
            </div>
          </selectable-list>

          <i class="material-icons selectorIcon">chevron_right</i>

          <selectable-list
            class="list2"
            :items="selectedActors"
            :messages="messagesSelected"
            :hasFilter="false"
            @cancel="hideModal"
            @select="removeActor">
            <div slot="item" slot-scope="props" class="listEntry">
              <entry-icon :item="props.item" />
              <div>{{ props.item.title }}</div>
            </div>
          </selectable-list>
        </div>
      </div>
      <div class="footer">
        <button class="btn btn-medium gray waves-effect waves-light" @click="hideModal">
          Abbrechen
        </button>
        <button class="btn btn-medium green waves-effect waves-light" @click="save">
          Speichern
        </button>
      </div>
    </modal>

    <a href="" class="inlineEditLink" @click.prevent="showModal">
      {{ title }}
    </a>
  </div>
</template>

<script>
import Orga from '@/models/Orga'
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'
import sortByTitle from '@/helpers/sort-by-title'
import EntryIcon from '@/components/entry/EntryIcon'

export default {
  props: ['title', 'actor', 'relationName'],

  data () {
    return {
      actors: [],
      selectableActors: [],
      selectedActors: [],
      isLoading: false,

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
    this.isLoading = true
    Orga.Query.getAll().then(actors => {
      this.actors = sortByTitle(actors)
      this.initSelectableActors()
      this.isLoading = false
    })
  },

  methods: {
    initSelectableActors () {
      this.selectableActors = this.actors.filter(a => !this.selectedActors.includes(a))
    },

    initSelectedActors () {
      this.selectedActors = []
      this.actor[this.relationName].forEach(actor => {
        this.selectedActors.push(actor)
      })
    },

    showModal () {
      this.initSelectedActors()
      this.initSelectableActors()
      this.$refs.modal.show()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    addActor (actor) {
      if (!this.selectedActors.includes(actor)) {
        this.selectedActors.push(actor)
        this.selectedActors = sortByTitle(this.selectedActors)
        this.initSelectableActors()
      }
    },

    removeActor (actor) {
      if (this.selectedActors.includes(actor)) {
        this.selectedActors = this.selectedActors.filter(a => a !== actor)
        this.initSelectableActors()
      }
    },

    save () {
      this.hideModal()

      this.actor.actor_relations.$rels[this.relationName].Query.attachMany(this.selectedActors).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Netzwerke wurden gespeichert.'
          })
          this.$emit('saved')
        }
      })
    }
  },

  components: {
    Modal,
    SelectableList,
    EntryIcon
  }
}
</script>

<style lang="scss" scoped>
.modalWindow /deep/ .modal__window {
  width: 80%;
  max-width: 1000px;
}

.ownerInfo {
  margin-bottom: 20px;

  i {
    vertical-align: middle;
    font-size: 1.2em;
  }
}

.actorSelector {
  width: 100%;
  display: flex;
  justify-content: space-between;

  > * {
    width: 50%;
  }

  .selectorIcon {
    width: auto;
    margin: 0 10px;
    align-self: center;
  }

  .list2 {
    align-self: flex-end;

    /deep/ .title {
      margin-bottom: 2.8em;
    }
  }
}

.listEntry {
  display: flex;
  align-items: center;
  line-height: 1.4em;

  .entryTypeIcon {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }
}

.footer {
  margin-top: 2em;
  text-align: right;
  button {
    margin-left: .4em;
  }
}
</style>
