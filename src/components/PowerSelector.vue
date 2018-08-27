<template>
  <div>
    <modal ref="modal">
      <div class="modalContent">
        <div class="ownerInfo">
          Auswählen
        </div>

        <selectable-list
          :items="filteredItems"
          :messages="{}"
          :searchFields="searchFields"
          @cancel="hideModal"
          @select="submitItem">
          <div slot="item" slot-scope="props">
            <slot name="item" :item="props.item"></slot>
          </div>
        </selectable-list>
      </div>
    </modal>

    <div class="infos">
      {{ selectedItems.length }} Einträge ausgewählt

      <a href="" class="inlineEditLink" @click.prevent="showModal">
        Zeige Liste
      </a>
    </div>

  </div>
</template>


<script>
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'

export default {
  props: ['items', 'selectedItems', 'searchFields', 'messages'],

  data () {
    return {
      show: false,
      filteredItems: []
    }
  },

  methods: {
    filterItems () {
      const selectedItems = this.selectedItems || []
      const filteredItems = this.items.filter(item => {
        const isSelected = selectedItems.some(selectedItem => {
          return selectedItem.id === item.id
        })
        if (isSelected) {
          return false
        } else {
          return true
        }
      })
      this.filteredItems = filteredItems
    },

    showModal () {
      this.filterItems()
      this.$refs.modal.show()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    submitItem (item) {
      this.hideModal()
      this.$emit('select', item)
    },

    removeItem (item) {
      this.$store.dispatch('messages/showDialog', {
        title: this.messages.removeTitle,
        message: this.messages.removeMessage(item)
      }).then(result => {
        if (result === 'yes') {
          this.$emit('remove', item)
        }
      })
    }
  },

  watch: {
    items () {
      this.filterItems()
    }
  },

  components: {
    SelectableList,
    Modal
  }
}
</script>


<style lang="scss" scoped>
  .modalContent {
    width: 800px;
  }

  .infos {
    margin-top: 20px;
  }
</style>
