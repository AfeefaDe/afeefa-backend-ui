<template>
  <div class="ps">
    <transition name="fade">
      <div class="ps__glassframe" v-if="show" @click="close"></div>
    </transition>
    <ul class="ps__selectedItems" v-if="selectedItems">
      <li v-for="item in selectedItems" :key="item.id" class="ps__selectedItem">
        <div>
          <slot name="selected-item" :item="item"></slot>
        </div>
        <div>
          <a href="" @click.prevent="removeItem(item)">Entfernen</a>
        </div>
      </li>
    </ul>

    <button type="button" class="btn btn-small waves-effect waves-light saveButton" @click.prevent="showSelector">
      <i class="material-icons left">add</i>
      {{ messages.addButtonTitle }}
    </button>

    <transition name="fade">
      <div v-if="show" class="ps__selector">
        <div class="ps__closeIcon" @click="close">
          <i class="material-icons">close</i>
        </div>

        <h3>Netzwerk auswählen</h3>

        <input type="text" v-model="keyword" ref="keywordInput"
          placeholder="Tippen, um zu filtern"
          @input="keywordChanged"
          @keydown.up.prevent="selectPrevious"
          @keydown.down.prevent="selectNext"
          @keydown.esc.prevent="close"
          @keydown.enter.prevent="submitCurrentItem">

        <ul class="ps__items">
          <li v-for="(item, index) in filteredItems" :key="item.id"
            @click="submitItem(item)"
            :class="['ps__item', {'ps__item--selected': index === selectedItemIndex}]">
            <slot name="item" :item="item"></slot>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>


<script>
import Vue from 'vue'

export default {
  props: ['items', 'selectedItems', 'searchFields', 'messages'],

  data () {
    return {
      show: false,
      keyword: '',
      filteredItems: [],
      selectedItemIndex: null
    }
  },

  methods: {
    keywordChanged (event) {
      this.filterItems()
    },

    filterItems () {
      const selectedItems = this.selectedItems || []
      const filteredItems = this.items.filter(item => {
        const isSelected = selectedItems.some(selectedItem => {
          return selectedItem.id === item.id
        })
        if (isSelected) {
          return false
        }

        const keywords = this.keyword.split(' ')
        let findCount = 0
        for (let keyword of keywords) {
          const hasFound = this.searchFields.some(field => {
            let value = item[field]
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
      this.filteredItems = filteredItems

      this.selectedItemIndex = this.keyword && filteredItems.length ? 0 : null
    },

    selectNext () {
      if (this.selectedItemIndex === null) {
        return
      }

      if (this.selectedItemIndex === this.filteredItems.length - 1) {
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
        this.selectedItemIndex = this.filteredItems.length - 1
      } else {
        this.selectedItemIndex--
      }
      this.scrollResults()
    },

    submitCurrentItem () {
      if (this.selectedItemIndex === null) {
        return
      }

      const item = this.filteredItems[this.selectedItemIndex]
      this.submitItem(item)
    },

    scrollResults () {
      if (this.selectedItemIndex === null) {
        return
      }

      const ul = document.querySelector('.ps__items')
      const li = document.querySelectorAll('.ps__items li')[this.selectedItemIndex]

      if (li.offsetTop < ul.scrollTop) {
        ul.scrollTop = li.offsetTop
      }

      if (li.offsetTop + li.offsetHeight > ul.scrollTop + ul.offsetHeight) {
        ul.scrollTop = li.offsetTop + li.offsetHeight - ul.offsetHeight
      }
    },

    focusInput () {
      Vue.nextTick(() => {
        this.$refs.keywordInput.focus()
      })
    },

    showSelector () {
      this.selectedItemIndex = null
      this.keyword = ''
      this.filterItems()
      this.show = true
      this.focusInput()
    },

    close () {
      this.show = false
    },

    submitItem (item) {
      this.close()
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
  }
}
</script>


<style lang="scss" scoped>
  .ps__glassframe {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: .3;
  }

  .ps__selector {
    position: fixed;
    top: ($header-height*1.1);
    left: 50%;
    width: 600px;
    z-index: 6;
    background-color: white;
    padding: 20px;
    transform: translateX(-50%);
    border-radius: 2px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
    h3 {
      font-size: 1.2rem;
      margin: 0 0 20px;
    }
  }
  .ps__closeIcon {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
    i {
      font-size: 30px;
    }
  }
  .ps__selectedItems {
    .item {
      background-color: red;
    }
  }

  .ps__selectedItem {
    > div {
      display: inline-block;
    }
  }

  .ps__items {
    overflow: auto;
    height: 400px;
    position: relative;
  }

  .ps__item {
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
</style>
