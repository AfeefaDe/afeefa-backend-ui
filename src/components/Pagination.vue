<template>
  <div class="list-pagination">
    <div class="list-pagination__info">

      <p class="list-pagination__infoText">{{ currentNumItems }} {{ $tc('pagination.entries', currentNumItems) }}
      ({{ $t('pagination.page') }} {{ currentPage }} {{ $t('pagination.of') }} {{ currentNumPages }})</p>
      <label class="list-pagination__pagesizeSelectLabel" for="pageSizeSelect" v-if="currentNumItems > 15">{{ $t('pagination.set_page_size') }}:</label>
      <select v-model="currentPageSize"
        @change="pageSizeChanged"
        class="list-pagination__pagesizeSelect browser-default"
        v-if="currentNumItems > 15"
        id="pageSizeSelect">
        <option value="15">15 {{ $t('pagination.per_page') }}</option>
        <option value="30">30 {{ $t('pagination.per_page') }}</option>
        <option value="1000">{{ $t('status.all') }}</option>
      </select>

    </div>

    <div class="list-pagination__navigation" v-if="currentNumPages > 1">
      <a
          :class="[(currentPage > 1 ? 'enabled' : 'disabled')]"
          class="list-pagination--arrowButton"
          @click.prevent="gotoPrev()">
        <i class="material-icons">navigate_before</i>
      </a>
      <div class="list-pagination__navigationPages">
        <a v-for="pageNumber in currentNumPages"
          href="" @click.prevent="goto(pageNumber)"
          :class="[(pageNumber == currentPage ? 'active' : 'inactive')]">
          {{ pageNumber }}
        </a>
      </div>
      <a
          :class="[(currentPage < currentNumPages ? 'enabled' : 'disabled')]"
          class="list-pagination--arrowButton"
          @click.prevent="gotoNext()">
        <i class="material-icons">navigate_next</i>
      </a>
    </div>

  </div>
</template>


<style lang="scss">
@import "~variables";

.list-pagination {
  margin-bottom: 1em;
  &__info {
    display: flex;
    align-items: baseline;
    margin-bottom: 0.7em;
    @media screen and (max-width: $break-medium) {
      display: block;
    }
  }
  &__infoText {
    flex-grow: 2;
    margin: 0;
  }
  &__pagesizeSelect {
    display: inline-block;
    width: auto;
    height: auto;
  }
  &__pagesizeSelectLabel {
    margin-right: 1em;
  }

  &__navigation {
    display: flex;
    justify-content: center;
    word-wrap: break-word;
    a {
      display: inline-block;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.3em 0.6em;
      border-radius: 2px;
      color: $black;
      vertical-align: middle;
    }
    a:hover {
      background: $gray20;
    }
    a.active {
      background: $pink;
      color: white;
    }
  }
  &--arrowButton {
    height: 24px;
    box-sizing: initial;
  }
  &--arrowButton.disabled {
    cursor: initial;
    color: $gray20;
  }
  &--arrowButton.disabled:hover {
    background: transparent;
  }
}
</style>


<script>
export default {
  props: ['numItems', 'page', 'pageSize'],

  data () {
    return {
      currentNumItems: this.numItems,
      currentPage: this.page,
      currentPageSize: this.pageSize
    }
  },

  created () {
    this.initProps()
  },

  computed: {
    currentNumPages () {
      return Math.ceil(this.currentNumItems / this.currentPageSize)
    }
  },

  watch: {
    numItems (val) {
      if (val === this.currentNumItems) {
        return
      }
      this.initProps()
    },

    page (val) {
      if (val === this.currentPage) {
        return
      }
      this.initProps()
    },

    pageSize (val) {
      if (val === this.currentPageSize) {
        return
      }
      this.initProps()
    }
  },

  methods: {
    initProps () {
      const numItems = parseInt(this.numItems) || 0
      let pageSize = parseInt(this.pageSize)
      let currentPage = parseInt(this.page) || 1
      if (![15, 30, 1000].includes(pageSize)) {
        pageSize = 15
        currentPage = 1
      }
      currentPage = Math.max(1, currentPage)
      const numPages = Math.ceil(numItems / pageSize)
      if (currentPage > numPages) {
        currentPage = 1
      }

      this.currentNumItems = numItems
      this.currentPage = currentPage
      this.currentPageSize = pageSize
    },

    gotoNext () {
      if (this.currentPage < this.currentNumPages) {
        this.goto(this.currentPage + 1)
      }
    },

    gotoPrev () {
      if (this.currentPage > 1) {
        this.goto(this.currentPage - 1)
      }
    },

    goto (page) {
      this.currentPage = page
      this.$emit('changed', {page, pageSize: this.currentPageSize})
    },

    pageSizeChanged () {
      this.currentPage = 1
      let newPageSize = parseInt(this.currentPageSize)
      this.$emit('changed', {page: 1, pageSize: newPageSize})
    }
  }
}
</script>
