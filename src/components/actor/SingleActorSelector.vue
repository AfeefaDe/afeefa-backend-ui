<template>
  <div>
    <modal ref="modal" class="modalWindow">
      <div class="modalContent">
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
        </div>
      </div>
    </modal>

    <div @click="showModal">
      <slot name="triggerButton">
        <a href="" class="inlineEditLink" @click.prevent>
          Hinzufügen
        </a>
      </slot>
    </div>

  </div>
</template>

<script>
import Orga from '@/models/Orga'
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'
import sortByTitle from '@/helpers/sort-by-title'

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
      this.$refs.modal.show()

      this.initSelectedActors()

      this.isLoading = true
      Orga.Query.getAll().then(actors => {
        this.actors = sortByTitle(actors)
        this.initSelectedActors()
        this.initSelectableActors()
        this.isLoading = false
      })
    },

    hideModal () {
      this.$refs.modal.close()
    },

    addActor (actor) {
      this.hideModal()

      if (this.actor.id) {
        this.saveActor(actor).then(() => {
          this.$emit('added', actor)
        })
      } else {
        this.$emit('added', actor)
      }
    },

    saveActor (actor) {
      return this.actor.$rels[this.relationName].Query.attach(actor).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Der Akteur wurde hinzugefügt.'
          })
        }
      })
    }
  },

  components: {
    Modal,
    SelectableList
  }
}
</script>

<style lang="scss" scoped>
.modalWindow /deep/ .modal__window {
  width: 600px;
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

  .entryIcon /deep/ i {
    font-size: 1.1em;
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
