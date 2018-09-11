<template>
  <div class="selectableList">
    <div v-if="selectedItems.length" class="disabledLabel">
      <input-label :title="labelHint" />
    </div>

    <div class="selectedItems" v-if="selectedItems.length">
      <div v-for="item in selectedItems" :key="item.id">
        <slot name="selectedItem" :item="item"></slot>
      </div>
    </div>

    <div class="noSelectedItems" v-else-if="maxSelectableItems > 1">
      <slot name="noSelectedItems" />
    </div>

    <div v-if="isLoading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> {{ messages.loading }}...
    </div>

    <div v-else>
      <div class="list" v-if="selectEnabled">
        <input-label :title="`Tippen, um ${title} auszuwählen`" />

        <input type="text" class="browser-default" v-model="keyword" ref="keywordInput"
          placeholder="Suchbegriff"
          @input="keywordChanged"
          @blur="onBlur"
          @focus="onFocus"
          @keydown.up.prevent="selectPrevious"
          @keydown.down.prevent="selectNext"
          @keydown.esc.prevent="onEscape"
          @keydown.enter.prevent="enter">

        <div class="selectableItems" v-if="focus && selectableItems.length && keyword.length">
          <div v-for="(item, index) in selectableItems" :key="item.id"
            :class="['item', {'item--selected': index === selectedItemIndex}]"
            @mousedown.prevent @click.prevent="select(item)">
            <slot name="item" :item="item" :selected="index === selectedItemIndex"></slot>
          </div>
        </div>
      </div>

      <div class="footer">
        <button type="button" class="btn btn-small gray waves-effect waves-light" @click="cancel">
          Abbrechen
        </button>
        <button v-if="hasChanges" type="button" class="btn btn-small green waves-effect waves-light" @click="save">
          Speichern
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import Spinner from '@/components/Spinner'
import sortByKeyword from '@/helpers/sort-by-keyword'
import InputLabel from '@/components/InputLabel'
import { replaceUmlauts } from '@/helpers/sort-by-title'

export default {
  props: ['items', 'selectedItems', 'title', 'messages', 'isLoading', 'searchFields', 'maxSelectableItems'],

  data () {
    const searchFields = this.searchFields || ['title']
    return {
      initialSelectedItems: [],
      selectableItems: [],
      keyword: '',
      selectedItemIndex: null,
      searchInFields: searchFields,
      focus: false
    }
  },

  created () {
    this.initialSelectedItems = this.selectedItems.concat()
    this.initSelectableItems()
  },

  mounted () {
    this.focusInput()
  },

  watch: {
    items () {
      this.initSelectableItems()
    },

    selectedItems () {
      this.initSelectableItems()
    }
  },

  computed: {
    selectEnabled () {
      if (this.maxSelectableItems !== undefined) {
        return this.selectedItems.length < this.maxSelectableItems
      }
      return true
    },

    hasChanges () {
      return this.initialSelectedItems.length !== this.selectedItems.length ||
        this.initialSelectedItems.some((item, index) => item !== this.selectedItems[index])
    },

    labelHint () {
      return `${this.selectedItems.length} von ${this.maxSelectableItems} ausgewählt`
    }
  },

  methods: {
    initSelectableItems () {
      this.selectableItems = []
      const selectableItems = this.items.filter(a => {
        const keywords = this.keyword.split(' ')
        let findCount = 0
        for (let keyword of keywords) {
          const hasFound = this.searchInFields.some(field => {
            let value = a[field]
            if (!value) {
              if (!keyword) {
                return true
              }
            } else {
              const testValue = replaceUmlauts(value.toLowerCase())
              const testKeyword = replaceUmlauts(keyword.toLowerCase())
              if (testValue.includes(testKeyword)) {
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

      this.selectableItems = sortByKeyword(selectableItems, this.keyword)

      if (this.selectableItems.length) {
        this.selectedItemIndex = Math.max(this.selectedItemIndex, 0)
        this.selectedItemIndex = Math.min(this.selectedItemIndex, this.selectableItems.length - 1)
      } else {
        this.selectedItemIndex = null
      }
    },

    selectNext () {
      if (!this.selectableItems.length) {
        this.selectedItemIndex = null
        return
      }

      if (this.selectedItemIndex === null) {
        this.selectedItemIndex = -1
      }

      if (this.selectedItemIndex === this.selectableItems.length - 1) {
        this.selectedItemIndex = 0
      } else {
        this.selectedItemIndex++
      }
      this.scrollResults()
    },

    selectPrevious () {
      if (!this.selectableItems.length) {
        this.selectedItemIndex = null
        return
      }

      if (this.selectedItemIndex === null) {
        this.selectedItemIndex = this.selectableItems.length
      }

      if (this.selectedItemIndex === 0) {
        this.selectedItemIndex = this.selectableItems.length - 1
      } else {
        this.selectedItemIndex--
      }
      this.scrollResults()
    },

    scrollResults () {
      if (!this.selectableItems.length) {
        return
      }

      const ul = document.querySelector('.selectableItems')
      const li = document.querySelectorAll('.selectableItems > div')[this.selectedItemIndex]

      if (li.offsetTop < ul.scrollTop) {
        ul.scrollTop = li.offsetTop
      }

      if (li.offsetTop + li.offsetHeight > ul.scrollTop + ul.offsetHeight) {
        ul.scrollTop = li.offsetTop + li.offsetHeight - ul.offsetHeight
      }
    },

    onBlur () {
      this.focus = false
    },

    onFocus () {
      this.focus = true
    },

    onEscape () {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.cancel()
      }
    },

    keywordChanged () {
      this.initSelectableItems()
    },

    enter () {
      if (this.selectedItemIndex === null) {
        return
      }

      const item = this.selectableItems[this.selectedItemIndex]
      this.select(item)
    },

    select (item) {
      const index = this.selectableItems.indexOf(item)
      this.selectedItemIndex = index
      this.$emit('select', item)
      // this.focusInput()
      this.blurInput()
    },

    focusInput () {
      Vue.nextTick(() => {
        // component might be destroyed in the meantime
        if (this.$refs.keywordInput) {
          this.$refs.keywordInput.focus()
          this.focus = true
        }
      })
    },

    blurInput () {
      Vue.nextTick(() => {
        // component might be destroyed in the meantime
        if (this.$refs.keywordInput) {
          this.$refs.keywordInput.blur()
          this.focus = false
        }
      })
    },

    cancel () {
      this.$emit('cancel')
    },

    save () {
      this.$emit('save')
    }
  },

  components: {
    Spinner,
    InputLabel
  }
}
</script>

<style lang="scss" scoped>
.selectableList {
  width: 100%;
  input {
    height: 2.3rem;

    &.transparent {
      opacity: 0;
    }
  }
}

.list {
  position: relative;
}

.disabledLabel {
  margin-bottom: 1.5em;
}

.selectableItems {
  width: 100%;
  max-height: 30vh;
  overflow-y: auto;
  position: absolute;
  box-shadow: 0 7px 20px 0 rgba(0,0,0,0.3);
}

.selectedItems {
  max-height: 30vh;
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 1.5em;

  > :not(:last-child) {
    margin-bottom: .6em;
  }
}

.noSelectedItems {
  margin-bottom: 1.5em;
}

.item {
  @include user-select();

  background-color: lighten($gray10, 5);
  padding: 5px;
  cursor: pointer;

  &:nth-child(2n) {
    background-color: white;
  }

  &:hover,
  &:nth-child(2n):hover {
    background-color: lighten($blueHightlight, 35);
    color: $black;
  }

  &--selected, &--selected:hover,
  &--selected:nth-child(2n), &--selected:nth-child(2n):hover {
    background-color: lighten($blueHightlight, 10);
    color: white;
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
