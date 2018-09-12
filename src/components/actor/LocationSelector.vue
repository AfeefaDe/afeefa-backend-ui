<template>
  <div class="editableLocations">

    <modal ref="modal" class="modalWindow" :hasClose="false">
      <div class="modalContent">
        <div class="locationSelector">
          <selectable-list
            title="Adresse"
            :items="listObjs"
            :selectedItems="[]"
            :searchFields="['title', 'actorsString']"
            :messages="messagesSelectable"
            :isLoading="isLoading"
            :maxSelectableItems="1"
            @select="selectLocation"
            @cancel="hideModal">

            <div slot="item" slot-scope="props" :class="['selectableItem', {selected: props.selected}]">
              <entry-icon :item="{type: 'locations', active: true}" />
              <div>
                <div class="location">{{ props.item.title }}</div>
                <div class="title" v-for="actor in props.item.actors" :key="actor.id">
                  <entry-icon :item="{type: 'orgas', active: true}" />
                  <div>{{ actor.title }}</div>
                </div>
              </div>
            </div>
          </selectable-list>
        </div>
      </div>
    </modal>

    <div @click="showModal">
      <slot />
    </div>

  </div>
</template>

<script>
import Modal from '@/components/Modal'
import SelectableList from '@/components/selector/SelectableList'
import Location from '@/models/Location'

export default {
  data () {
    return {
      isLoading: false,
      listObjs: [],
      locations: [],

      messagesSelectable: {
        loading: 'Lade Adressen',
        title: 'Alle',
        notFound: 'Nichts gefunden'
      }
    }
  },

  methods: {
    showModal () {
      this.$refs.modal.show()
      this.loadLocations()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    loadLocations () {
      this.isLoading = true
      Location.Query.getAll().then(locations => {
        this.locations = locations
        this.listObjs = locations.map(location => {
          const locationString = location.street + ' ' +
            location.zip + ' ' +
            location.city

          return {
            id: location.id,
            title: locationString.trim(),
            actorsString: location.linking_actors.map(a => a.title).join(', ').trim(),
            actors: location.linking_actors
          }
        })
        this.isLoading = false
      })
    },

    selectLocation (listObj) {
      const location = this.locations.find(c => c.id === listObj.id)
      this.$emit('select', location)
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

.selectableItem {
  display: flex;
  align-items: center;
  line-height: 1.3em;
  padding: 0 .5em;

  .entryIcon /deep/ i {
    font-size: 1.1em;
    margin-right: 1em;
  }

  .location + .title {
    margin-top: .3em;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: .9em;

    .entryIcon /deep/ i {
      font-size: 1em;
      margin-right: .8em;
      position: relative;
      top: .1em;
    }
  }

  &:not(.selected) {
    .title {
      color: $gray50;
    }
  }
}

.noSelectedItems {
  margin-bottom: .4em;
}
</style>
