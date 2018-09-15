<template>
  <div class="editableContacts">

    <modal ref="modal" class="modalWindow" :hasClose="false">
      <div class="modalContent">
        <div class="contactSelector">
          <selectable-list
            title="Kontakt"
            :items="listObjs"
            :selectedItems="[]"
            :searchFields="['title', 'persons', 'location']"
            :messages="messagesSelectable"
            :isLoading="isLoading"
            :maxSelectableItems="1"
            @select="selectContact"
            @cancel="hideModal">

            <div slot="item" slot-scope="props" :class="['selectableItem', {selected: props.selected}]">
              <entry-icon :item="{type: 'contacts', active: true}" />
              <div>
                <div class="title">{{ props.item.title }}</div>
                <div class="location" v-if="props.item.location">{{ props.item.location }}</div>
                <div class="persons" v-if="props.item.persons">{{ props.item.persons }}</div>
              </div>
            </div>
          </selectable-list>
        </div>
      </div>
    </modal>

    <div class="trigger" @click="showModal">
      <slot />
    </div>

  </div>
</template>

<script>
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'
import Contact from '@/models/Contact'

export default {
  data () {
    return {
      isLoading: false,
      listObjs: [],
      contacts: [],

      messagesSelectable: {
        loading: 'Lade Kontakte',
        title: 'Alle',
        notFound: 'Nichts gefunden'
      }
    }
  },

  methods: {
    showModal () {
      this.$refs.modal.show()
      this.loadContacts()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    loadContacts () {
      this.isLoading = true
      Contact.Query.getAll().then(contacts => {
        this.contacts = contacts
        this.listObjs = contacts.map(contact => {
          let location = ''
          if (contact.location) {
            location = contact.location.street + ' ' +
              contact.location.zip + ' ' +
              contact.location.city
          }

          return {
            id: contact.id,
            title: contact.owner.title,
            persons: contact.contact_persons.map(person => {
              return person.name + ' ' +
              person.phone + ' ' +
              person.mail
            }).join(', '),
            location
          }
        })
        this.isLoading = false
      })
    },

    selectContact (listObj) {
      const contact = this.contacts.find(c => c.id === listObj.id)
      this.$emit('select', contact)
      this.hideModal()
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
  padding: 2em 1.5em 1.7em;
}

.trigger {
  display: inline-block;
}

.selectableItem {
  display: flex;
  align-items: center;
  line-height: 1.3em;
  padding: 0 .5em;

  .entryIcon /deep/ i {
    font-size: 1.1em;
    margin-right: 1em;
  }

  .location, .persons {
    font-size: .9em;
  }

  &:not(.selected) {
    .location, .persons {
      color: $gray50;
    }
  }
}

.noSelectedItems {
  margin-bottom: .4em;
}
</style>
