<template>
  <div class="list-pagination">
    <div class="list-pagination__info">
      {{ currentNumItems }} {{ $tc('pagination.entries', currentNumItems) }}
      ({{ $t('pagination.page') }} {{ currentPage }} {{ $t('pagination.of') }} {{ currentNumPages }})
    </div>

    <div class="list-pagination__navigation" v-if="currentNumPages > 1">
      <a v-for="pageNumber in currentNumPages"
        href="" @click.prevent="goto(pageNumber)"
        :class="[(pageNumber == currentPage ? 'active' : 'inactive')]">{{ pageNumber }}</a>
    </div>

    <select v-model="currentPageSize"
      @change="pageSizeChanged"
      class="list-pagination__pagesize browser-default"
      v-if="currentNumItems > 15">
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
    numItems (val, old) {
      if (val === this.currentNumItems) {
        return
      }
      this.initProps()
    },

    page (val, old) {
      if (val === this.currentPage) {
        return
      }
      this.initProps()
    },

    pageSize (val, old) {
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

    goto (page) {
      this.currentPage = page
      this.$emit('changed', {page, pageSize: this.currentPageSize})
    },

    pageSizeChanged () {
      this.currentPage = 1
      this.$emit('changed', {page: 1, pageSize: this.currentPageSize})
    }
  }
}
</script>
