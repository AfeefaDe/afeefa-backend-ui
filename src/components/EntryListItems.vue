<template>
  <div>
    <div v-if="!items">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Liste
    </div>

    <div v-else>
      <pagination
      :num-items="currentNumItems"
      :page-size="currentPageSize"
      :page="currentPage"
      @changed="setPage"
      v-if="has.pagination">
    </pagination>
    </div>

    <ul class="entryList">
      <li v-for="item in itemsSorted">
        <div v-if="!showIcon" class="entryList__icon">
          <span :class="['entryType-icon',  'entryType-icon--' + item.type, 'entryType-icon--' + (item.active ? 'active' : 'inactive')]"></span>
        </div>

        <div class="entryList__content">

          <router-link :to="{name: item.type + '.show', params: {id: item.id}}" class="entryList__nav">
            <h4 class="title">{{ item.title || 'Kein Titel' }}</h4>
            <span class="icon"><i v-if="!showIcon" class="material-icons">navigate_next</i></span>
          </router-link>

          <div class="entryList__attributes">
            <p class="item category" v-if="item.category">
              {{ $t('categories.' + item.category.title) }}
              <span v-if="item.sub_category">
                <i class="material-icons">navigate_next</i>
                {{ $t('categories.' + item.sub_category.title) }}
              </span>
            </p>

            <annotation-tag v-if="has.annotations" v-for="annotation in item.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>

            <p class="item entryList--lightColor" v-if="has.event_date">
              {{item | formatEventDate}}
            </p>

            <p class="item entryList--lightColor" v-if="has.updated_at">
              {{ $t('status.changed') }}
              {{item.updated_at | formatDateAbsolute}}
              <span>({{item.updated_at | formatDateRelative}})</span>
            </p>

            <p class="item entryList--lightColor" v-if="has.date_start">
              {{ $t('status.time') }}
              {{item.date_start | formatDateRelative}}
              <span>({{item.date_start | formatDateAbsolute}})</span>
            </p>

            <p class="item entryList--lightColor" v-if="has.created_at">
              {{ $t('status.added') }}
              {{item.created_at | formatDateAbsolute}}
              <span>({{item.created_at | formatDateRelative}})</span>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
import Pagination from '@/components/Pagination'
import AnnotationTag from '@/components/AnnotationTag'
import Spinner from '@/components/Spinner'

export default {
  props: ['items', 'limit', 'sortFunction', 'sortOrder', 'showIcon', 'options'],

  data () {
    const options = this.options || {}
    return {
      currentPageSize: 15,
      currentPage: 1,
      currentNumItems: 0,
      has: {
        pagination: options.pagination,
        annotations: options.annotations,
        updated_at: options.updated_at,
        created_at: options.created_at,
        event_date: options.event_date
      }
    }
  },

  created () {
    this.initPageProperties()
  },

  watch: {
    '$route' () {
      this.initPageProperties()
    }
  },

  computed: {
    itemsSorted () {
      let items = this.sortFunction ? this.sortFunction(this.items, this.sortOrder) : this.items
      this.currentNumItems = items.length
      if (this.limit) {
        items = items.slice(0, this.limit)
      }
      const pageNumber = Math.min(Math.max(1, this.currentPage), Math.ceil(items.length / this.currentPageSize))
      const index = (pageNumber - 1) * this.currentPageSize
      items = items.slice(index, index + this.currentPageSize)
      return items
    }
  },

  methods: {
    initPageProperties () {
      this.currentPage = this.$route.query.page || 1
      this.currentPageSize = this.$route.query.pageSize || 15
    },

    setPage (config) {
      this.currentPage = config.page
      this.currentPageSize = config.pageSize

      const query = {...this.$route.query}
      query.page = config.page === 1 ? undefined : config.page
      query.pageSize = config.pageSize === 15 ? undefined : config.pageSize
      this.$router.push({query: query})
    }
  },

  components: {
    Pagination,
    Spinner,
    AnnotationTag
  }
}
</script>

<style lang="scss" scoped>
@import "~variables";

.entryList {
  padding-left: 0;
  margin-top: 0;
  list-style: none;
  li {
    border-bottom: 2px solid $gray20;
    padding: 1em 0;
    display: flex;
    align-items: flex-start;
  }
  li:last-child {
    border-bottom: none
  }
  &__nav {
    cursor: pointer;
    color: inherit;
    display: flex;
    align-items: flex-end;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
    .title {
      flex-grow: 2;
      font-size: 1.4em;
      margin-bottom: 0.2em;
      margin-top: 0;
      font-weight: 500;
      line-height: 120%;
    }
  }
  &__content {
    flex-grow: 2;
  }
  &__icon {
    margin-right: 2em;
    margin-top: 0.3em;
    line-height: 100%;
  }
  &__attributes {
    align-items: baseline;
    font-size: 1em;
    color: $gray90;
    .category {
      font-size: 1.1em;
    }
    .item {
      margin: 0 1.5em 0 0;
      &.category {
        margin-bottom: .2em;
      }
    }
    .item .material-icons {
      vertical-align: bottom;
      font-size: 1.4em;
      margin-left: -0.3em;
      margin-right: -0.1em;
    }
    .meta {
      margin-right: 0.3em;
    }
  }
  &--lightColor {
    color: $gray50;
  }
}
</style>
