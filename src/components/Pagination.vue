<template>
  <div class="listPagination">
    <p class="listPagination__infoText">
      {{ currentNumItems }} {{ $tc('pagination.entries', currentNumItems) }}
    </p>

    <div class="listPagination__navigation" v-if="currentNumPages > 1">
      <a
        :class="[(currentPage > 1 ? 'enabled' : 'disabled')]"
        class="listPagination--arrowButton"
        @click.prevent="goto(1)">
        <i class="material-icons">first_page</i>
      </a>
      <a
        :class="[(currentPage > 1 ? 'enabled' : 'disabled')]"
        class="listPagination--arrowButton"
        @click.prevent="gotoPrev()">
        <i class="material-icons">navigate_before</i>
      </a>

      <div>{{ $t('pagination.page') }} {{ currentPage }} {{ $t('pagination.of') }} {{ currentNumPages }}</div>

      <div class="listPagination__navigationPages" v-if="false">
        <a v-for="pageNumber in currentNumPages" :key="pageNumber"
          href="" @click.prevent="goto(pageNumber)"
          :class="[(pageNumber == currentPage ? 'active' : 'inactive')]">
          {{ pageNumber }}
        </a>
      </div>
      <a
        :class="[(currentPage < currentNumPages ? 'enabled' : 'disabled')]"
        class="listPagination--arrowButton"
        @click.prevent="gotoNext()">
        <i class="material-icons">navigate_next</i>
      </a>
      <a
        :class="[(currentPage < currentNumPages ? 'enabled' : 'disabled')]"
        class="listPagination--arrowButton"
        @click.prevent="goto(currentNumPages)">
        <i class="material-icons">last_page</i>
      </a>
    </div>

    <select v-model="currentPageSize"
      @change="pageSizeChanged"
      class="listPagination__pagesizeSelect"
      v-if="currentNumItems > 15"
      id="pageSizeSelect">
      <option value="15">15 {{ $t('pagination.per_page') }}</option>
      <option value="30">30 {{ $t('pagination.per_page') }}</option>
      <option value="1000">{{ $t('status.all') }}</option>
    </select>
  </div>
</template>


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


<style lang="scss">
.listPagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .8em;

  @media screen and (max-width: $break-medium) {
    display: block;
  }

  &__infoText {
    flex-grow: 0;
    margin: 0;
    margin-bottom: 0.2em;
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
    word-wrap: break-word;
    margin-bottom: 0.2em;

    div {
      line-height: 24px;
    }

    a {
      @include user-select();

      display: inline-block;
      cursor: pointer;
      font-size: 1rem;
      border-radius: 2px;
      color: $black;
      vertical-align: middle;
    }

    a:hover {
      background: $gray20;
    }

    a.active {
      background: $secondaryBlue;
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
