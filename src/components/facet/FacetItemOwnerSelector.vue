<template>
  <div class="facetItemOwnerSelector">
    <modal ref="modal" class="modalWindow">
      <div class="modalContent">
        <div class="ownerInfo">
          {{ facetItem.title }} <i class="material-icons">chevron_right</i> {{ title }}
        </div>

        <div class="actorSelector">
          <selectable-list
            :items="selectableOwners"
            :messages="messagesSelectable"
            @cancel="hideModal"
            @select="addOwner">
            <div slot="item" slot-scope="props" class="listEntry">
              <entry-icon :item="props.item" />
              <div>
                <div>{{ props.item.title }}</div>
              </div>
            </div>
          </selectable-list>

          <i class="material-icons selectorIcon">chevron_right</i>

          <selectable-list
            class="list2"
            :items="newOwners"
            :hasFilter="false"
            :messages="messagesSelected"
            @cancel="hideModal"
            @select="removeOwner">
            <div slot="item" slot-scope="props" class="listEntry">
              <entry-icon :item="props.item" />
              <div>
                <div>{{ props.item.title }}</div>
              </div>
            </div>
          </selectable-list>

        </div>
      </div>

      <div class="footer">
        <button class="btn btn-medium gray waves-effect waves-light" @click="hideModal">
          Abbrechen
        </button>
        <button class="btn btn-medium green waves-effect waves-light" @click="save" :disabled="!newOwners.length">
          {{ newOwners.length || '' }} Hinzufügen
        </button>
      </div>
    </modal>

    <div @click="showModal" class="openButton">
      <slot name="openButton"></slot>
    </div>
  </div>
</template>

<script>
import Orga from '@/models/Orga'
import Offer from '@/models/Offer'
import Event from '@/models/Event'
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'
import sortByTitle from '@/helpers/sort-by-title'
import EntryIcon from '@/components/entry/EntryIcon'

export default {
  props: ['title', 'facetItem', 'type'],

  data () {
    return {
      owners: [],
      selectableOwners: [],
      selectedOwners: [],
      newOwners: [],

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
    fetchOwners () {
      const Model = {
        'orgas': Orga,
        'offers': Offer,
        'events': Event
      }[this.type]

      Model.Query.getAll().then(items => {
        this.owners = sortByTitle(items)

        this.facetItem.$rels.owners.Query.getAll().then(owners => {
          this.selectedOwners = owners.filter(o => o.type === this.type)
          this.initSelectableOwners()
        })
      })
    },

    initSelectableOwners () {
      this.selectableOwners = this.owners.filter(o => {
        return !this.selectedOwners.includes(o) &&
          !this.newOwners.includes(o)
      })
    },

    showModal () {
      this.newOwners = []
      this.fetchOwners()
      this.$refs.modal.show()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    addOwner (owner) {
      if (!this.newOwners.includes(owner)) {
        this.newOwners.push(owner)
        this.newOwners = sortByTitle(this.newOwners)
        this.initSelectableOwners()
      }
    },

    removeOwner (owner) {
      if (this.newOwners.includes(owner)) {
        this.newOwners = this.newOwners.filter(a => a !== owner)
        this.initSelectableOwners()
      }
    },

    save () {
      this.hideModal()

      if (this.newOwners.length) {
        this.facetItem.$rels.owners.Query.attachMany(this.newOwners).then(result => {
          if (result) {
            this.$store.dispatch('messages/showAlert', {
              description: 'Die Bla wurden gespeichert.'
            })
            this.$emit('saved')
          }
        })
      }
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
