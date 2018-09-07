<template>
  <div class="selectableList">
    <div class="title" v-if="false">
      {{ messages.title }} ({{ selectableItems.length }})
    </div>

    <text-input />

    <input v-if="has.filter" type="text" class="browser-default" v-model="keyword" v-focus ref="keywordInput"
      placeholder="Tippen, um zu filtern"
      @input="keywordChanged"
      @keydown.up.prevent="selectPrevious"
      @keydown.down.prevent="selectNext"
      @keydown.esc.prevent="cancel"
      @keydown.enter.prevent="enter">

    <div v-if="isLoading">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Einträge ...
    </div>

    <div class="selectableItems" v-else-if="selectableItems.length">
      <div v-for="(item, index) in selectableItems" :key="item.id"
        :class="['item', {'item--selected': has.filter && index === selectedItemIndex}]"
        @click="select(item)">
        <slot name="item" :item="item"></slot>
      </div>
    </div>
    <div v-else class="hint">
      {{ messages.notFound }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Spinner from '@/components/Spinner'

export default {
  props: ['items', 'hasFilter', 'title', 'messages', 'isLoading', 'searchFields'],

  data () {
    const has = { filter: this.hasFilter === undefined || this.hasFilter }
    const searchFields = this.searchFields || ['title']
    return {
      selectableItems: [],
      keyword: '',
      selectedItemIndex: null,
      searchInFields: searchFields,
      has
    }
  },

  created () {
    this.initSelectableItems()
  },

  watch: {
    items () {
      this.initSelectableItems()
    }
  },

  methods: {
    initSelectableItems () {
      this.selectableItems = this.items.filter(a => {
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

    keywordChanged () {
      this.initSelectableItems()
    },

    cancel () {
      this.$emit('cancel')
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

      this.focusInput()
    },

    focusInput () {
      Vue.nextTick(() => {
        // component might be destroyed in the meantime
        if (this.$refs.keywordInput) {
          this.$refs.keywordInput.focus()
        }
      })
    }
  },

  components: {
    Spinner
  }
}
</script>

<style lang="scss" scoped>
.selectableList {
  width: 100%;
  input {
    height: 2.3rem;
    margin: 1em 0;

    &.transparent {
      opacity: 0;
    }
  }
}

.title + div {
  margin-top: 1em;
}

.hint {
  height: 500px;
  color: $gray50;
}

.selectableItems {
  height: 500px;
  overflow-y: auto;
  position: relative;
}

.item {
  @include user-select();

  background-color: $gray10;
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
    background-color: $blueHightlight;
    color: white;
  }
}
</style>
