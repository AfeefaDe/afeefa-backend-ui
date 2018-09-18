<template>
  <div class="compactEntryList">
    <pagination
      v-if="entries.length > currentPageSize"
      :numItems="entries.length"
      :pageSize="currentPageSize"
      :page="1"
      :hasFirstLastPage="false"
      :hasPageSize="false"
      @changed="setPage">
    </pagination>

    <div class="entryContainer">
      <div v-for="(entry, index) in visibleItems" :key="entry.id" class="entry">
        <div class="content">
          <div class="entryView">
            <slot name="view" :entry="entry" :index="index" />
          </div>
        </div>

      </div>
    </div>

    <slot name="footer" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  props: ['entries', 'pageSize'],

  data () {
    return {
      currentPageSize: this.pageSize || 3,
      visibleItems: []
    }
  },

  watch: {
    entries () {
      this.initVisibleItems(1)
    }
  },

  created () {
    this.initVisibleItems(1)
  },

  methods: {
    setPage (config) {
      this.initVisibleItems(config.page)
    },

    initVisibleItems (page) {
      const index = (page - 1) * this.currentPageSize
      this.visibleItems = this.entries.slice(index, index + this.currentPageSize)
    }
  },

  components: {
    Pagination
  }
}
</script>

<style lang="scss">
.compactEntryList {
  .listPagination {
    justify-content: flex-start;
    font-size: .9em;
    margin-bottom: .5em;
  }

  .entry {
    width: 100%;
    display: flex;
    align-items: top;
    padding: .5em 0;
    border-bottom: 1px solid $gray10;
    &:first-child {
      border-top: 1px solid $gray10;
    }
  }

  .entryIcon {
    flex: 0 0 3.5em;
    font-size: .8em;
  }

  .content {
    flex-grow: 1;
  }
}
</style>
