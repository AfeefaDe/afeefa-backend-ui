<template>
  <div>
    <modal ref="modal">
      <div class="modalContent">
        <div class="ownerInfo">
          {{ actor.title }}
        </div>

        <div class="selectableActorsContainer">
          <input type="text" v-model="keyword" v-focus
            placeholder="Tippen, um zu filtern"
            @input="keywordChanged"
            @keydown.up.prevent="selectPrevious"
            @keydown.down.prevent="selectNext"
            @keydown.esc.prevent="hideModal"
            @keydown.enter.prevent="submitCurrentItem">
        </div>

        <div class="actorSelector">
          <div class="selectableActors">
            <div v-for="(actor, index) in selectableActors" :key="actor.id"
              :class="['actor', {'actor--selected': index === selectedItemIndex}]"
              @click="addActor(actor)">
              {{ actor.title }}
            </div>
          </div>

          <div class="selectedActors">
            <div v-for="actor in selectedActors" :key="actor.id"
              class="actor"
              @click="removeActor(actor)">
              {{ actor.title }}
            </div>
          </div>
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
import sortByTitle from '@/helpers/sort-by-title'

export default {
  props: ['title', 'actor', 'relationName'],

  data () {
    return {
      actors: [],
      selectableActors: [],
      selectedItemIndex: null,
      selectedActors: [],
      keyword: '',
      searchFields: ['title']
    }
  },

  created () {
    Orga.Query.getAll().then(actors => {
      this.actors = sortByTitle(actors)
      this.initSelectableActors()
    })
  },

  methods: {
    initSelectableActors () {
      this.selectableActors = this.actors.filter(a => {
        if (this.selectedActors.includes(a)) {
          return false
        }

        const keywords = this.keyword.split(' ')
        let findCount = 0
        for (let keyword of keywords) {
          const hasFound = this.searchFields.some(field => {
            let value = a[field]
            if (!value) {
              if (!keyword) {
                return true
              }
            } else {
              if (value.toLowerCase().includes(keyword.toLowerCase())) {
                return true
              }
            }
            return false
          })
          if (hasFound) {
            findCount++
          }
        }

        return findCount === keywords.length
      })

      this.selectedItemIndex = this.keyword && this.selectableActors.length ? 0 : null
    },

    initSelectedActors () {
      this.selectedActors = []
      this.actor[this.relationName].forEach(actor => {
        this.selectedActors.push(actor)
      })
    },

    selectNext () {
      if (this.selectedItemIndex === null) {
        return
      }

      if (this.selectedItemIndex === this.selectableActors.length - 1) {
        this.selectedItemIndex = 0
      } else {
        this.selectedItemIndex++
      }
      this.scrollResults()
    },

    selectPrevious () {
      if (this.selectedItemIndex === null) {
        return
      }

      if (this.selectedItemIndex === 0) {
        this.selectedItemIndex = this.selectableActors.length - 1
      } else {
        this.selectedItemIndex--
      }
      this.scrollResults()
    },

    scrollResults () {
      if (this.selectedItemIndex === null) {
        return
      }

      const ul = document.querySelector('.selectableActors')
      const li = document.querySelectorAll('.selectableActors > div')[this.selectedItemIndex]

      if (li.offsetTop < ul.scrollTop) {
        ul.scrollTop = li.offsetTop
      }

      if (li.offsetTop + li.offsetHeight > ul.scrollTop + ul.offsetHeight) {
        ul.scrollTop = li.offsetTop + li.offsetHeight - ul.offsetHeight
      }
    },

    showModal () {
      this.selectedItemIndex = null
      this.keyword = ''
      this.initSelectedActors()
      this.initSelectableActors()
      this.$refs.modal.show()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    keywordChanged () {
      this.initSelectableActors()
    },

    submitCurrentItem () {
      if (this.selectedItemIndex === null) {
        return
      }

      const actor = this.selectableActors[this.selectedItemIndex]
      this.addActor(actor)
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
    Modal
  }
}
</script>

<style lang="scss" scoped>
.modalContent {
  width: 800px;
}

.ownerInfo {
  margin-bottom: 20px;
}

.actorSelector {
  width: 100%;
  display: flex;
  justify-content: space-between;

  > * {
    width: 50%;
  }
}

.selectableActors {
  height: 500px;
  overflow-y: auto;
  position: relative;
  margin-right: 10px;
}

.actor {
  @include user-select();

  background-color: #EEEEEE;
  padding: 5px;
  cursor: pointer;

  &:nth-child(2n) {
    background-color: white;
  }

  &:hover,
  &:nth-child(2n):hover {
    background-color: lighten($blueHightlight, 20);
    color: white;
  }

  &--selected,
  &--selected:nth-child(2n) {
    background-color: $blueHightlight;
    color: white;
  }
}

.selectedActors {
  height: 500px;
  overflow-y: auto;
  margin-left: 10px;
}

.footer {
  margin-top: 2em;
  text-align: right;
  button {
    margin-left: .4em;
  }
}
</style>
