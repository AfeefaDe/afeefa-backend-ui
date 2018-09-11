<template>
  <div v-if="isLoading" class="entryListItems">
    <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Liste
  </div>

  <div v-else class="entryListItems">
    <filter-bar
      v-if="has.filter && items.length"
      :entries="items"
      :customSortOrders="customSortOrders"
      :options="{
        active: has.facetFilter,
        facets: has.facetFilter,
        sort: has.sort
      }"
      @filter="filterChanged"
      @sortOrder="sortOrderChanged"
      @keyword="keywordChanged">
      <slot name="customFilter" slot="customFilter" />
    </filter-bar>

    <div v-if="has.pagination" :class="['paginationTop', {empty: !currentNumItems}]">
      <pagination
        :num-items="currentNumItems"
        :page-size="currentPageSize"
        :page="currentPage"
        @changed="setPage">
      </pagination>
    </div>

    <ul class="entryList">
      <li v-for="item in sortedItems" :key="item.type + item.id" :style="{opacity: item.hasListData ? 1 : .2}">
        <div class="entryList__visual">
          <div v-if="has.typeIcon" class="entryList__icon">
            <entry-icon :item="item" />
            <div class="eventDate" v-if="item.hasListData && item.type === 'events'">
              <div class="day">{{ dayOfEvent(item) }}</div>
              <div class="month">{{ monthOfEvent(item) }}</div>
              <div class="year" v-if="yearOfEvent(item)">{{ yearOfEvent(item) }}</div>
            </div>
          </div>
        </div>

        <div class="entryList__content">
          <div class="entryList__attributes" v-if="item.hasListData && has.event_date && item.type === 'events'">
            <div class="entryList__date entryList--lightColor">
              {{item | formatEventDate}}
              <span>({{item.date_start | formatDateRelative}})</span>
            </div>
          </div>

          <router-link :to="routerLinkObject(item)" class="entryList__nav">
            <h4 class="title">{{ item.title || 'Kein Titel' }}</h4>
          </router-link>

          <div v-if="item.hasListData">
            <div v-if="item.type === 'orgas' && item.project_initiators.length">
              <entry-owners :items="item.project_initiators"></entry-owners>
            </div>

            <div v-if="item.type === 'offers' && item.owners.length">
              <entry-owners :items="item.owners"></entry-owners>
            </div>

            <div v-if="item.type === 'events' && item.hosts.length">
              <entry-owners :items="item.hosts"></entry-owners>
            </div>

            <div class="entryList__attributes" v-if="!has.annotations">
              <editable-entry-facet-items v-if="has.facetFilter" :entry="item" :bus="bus" />
              <entry-main-facet-items :entry="item" v-else />

              <editable-entry-navigation-items :entry="item" v-if="has.facetFilter && navigationIsSelected" />
            </div>

            <div v-if="has.annotations" class="annotations">
              <div v-for="annotation in item.annotations.slice(0, 1)" :key="annotation.id" class="annotation">
                <div class="details">
                  <span class="category">{{ annotation.annotationCategory.title}}:</span>
                  <span class="detail">{{ annotation.detail}}</span>
                  <span v-if="item.annotations.length > 1" class="moreAnnotations">
                    und {{ item.annotations.length - 1 }} weitere
                  </span>
                </div>

                <div class="entryList__status entryList--lightColor">
                  {{ $t('status.changed') }}
                  <span>{{annotation.updated_at | formatDateRelative}}</span>
                  <!-- <span v-if="annotation.last_editor"> von {{ annotation.last_editor.name }} <span v-if="annotation.last_editor.organization">({{ annotation.last_editor.organization }})</span></span> -->
                </div>
              </div>

            </div>

            <div class="entryList__numbers" v-if="!has.annotations">
              <span v-if="item.count_offers">{{ item.count_offers }} {{ $tc('offers.offer', item.count_offers) }}</span>
              <span v-if="item.count_events">{{ item.count_events }} Veranstaltungen</span>
              <span v-if="item.count_resource_items">{{ item.count_resource_items }} Ressourcen</span>
              <span v-if="item.count_projects">{{ item.count_projects }} Projekte</span>
              <span v-if="item.count_network_members">{{ item.count_network_members }} Mitglieder</span>
            </div>

            <div class="entryList__status entryList--lightColor" v-if="showUpdatedAt">
              {{ $t('status.changed') }}
              <span>{{ item.updated_at | formatDateRelative }}</span>
              <!-- {{item.updated_at | formatDateAbsolute}} -->
              <!-- <span>{{item.updated_at | formatDateRelative}} ({{item.updated_at | formatDateAbsolute}})</span> -->
              <!-- <span v-if="item.last_editor"> von {{ item.last_editor.name }} <span v-if="item.last_editor.organization">({{ item.last_editor.organization }})</span></span> -->
            </div>

            <div class="entryList__status entryList--lightColor" v-if="showCreatedAt">
              {{ $t('status.added') }}
              <!-- {{item.created_at | formatDateAbsolute}} -->
              <!-- <span>({{item.created_at | formatDateRelative}})</span> -->
              <span>{{item.created_at | formatDateRelative}}</span>
              <!-- <span v-if="item.creator"> von {{ item.creator.name }} <span v-if="item.creator.organization">({{ item.creator.organization }})</span></span> -->
            </div>
          </div>

        </div>

        <div class="entryList__actionButton">
          <slot name="actionButton" :item="item"></slot>
        </div>

      </li>
    </ul>

    <div v-if="currentNumItems && has.pagination">
      <pagination
        :num-items="currentNumItems"
        :page-size="currentPageSize"
        :page="currentPage"
        @changed="setPage">
      </pagination>
    </div>
  </div>
</template>


<script>
import Pagination from '@/components/Pagination'
import AnnotationTag from '@/components/AnnotationTag'
import Spinner from '@/components/Spinner'
import moment from 'moment'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'
import EntryMainFacetItems from '@/components/entry/facets/EntryMainFacetItems'
import EditableEntryNavigationItems from '@/components/entry/facets/EditableEntryNavigationItems'
import EntryOwners from '@/components/actor/EntryOwners'
import FilterBar from '@/components/entry/list/filterbar/FilterBar'
import { mapState } from 'vuex'
import sortByKeyword from '@/helpers/sort-by-keyword'
import sortByTitle, { replaceUmlauts } from '@/helpers/sort-by-title'

export default {
  props: {
    items: {},
    lazyLoad: {default: false},
    isLoading: {},
    limit: {},
    customSortOrders: {},
    options: {},
    modifyRoute: {default: true}
  },

  data () {
    const options = this.options || {}
    return {
      sortedItems: [],
      initSortedItemsNext: false,
      currentPageSize: 15,
      currentPage: 1,
      currentNumItems: 0,
      searchKeyword: '',

      currentSortFunction: null,
      currentSortOrder: null,
      currentSortField: null,

      bus: this,

      has: {
        facetFilter: options.facetFilter,
        filter: options.filter,
        sort: options.sort,
        pagination: options.pagination,
        annotations: options.annotations,
        updated_at: options.updated_at,
        created_at: options.created_at,
        event_date: options.event_date,
        typeIcon: !options.hideTypeIcon,
        // linkToItem specifies the router-link target: can be "show" (default) or "edit"
        linkToItem: options.linkToItem || 'show'
      }
    }
  },

  created () {
    this.initPageProperties()

    if (!this.has.sort && this.customSortOrders) {
      this.currentSortFunction = this.customSortOrders[0].sort
      this.currentSortOrder = this.customSortOrders[0].order
      this.currentSortField = this.customSortOrders[0].field
    }
  },

  watch: {
    '$route' (newItems, oldItems) {
      this.initPageProperties()
    },

    'items' (newItems, oldItems) {
      if (!this.has.filter) {
        this.searchKeyword = ''
        this.initSortedItems()
      }
    }
  },

  computed: {
    ...mapState({
      filteredEntries: state => state.entryListFilters.filteredEntries,
      navigationIsSelected: state => state.entryListFilters.navigationIsSelected
    }),

    showCreatedAt () {
      return this.has.created_at && this.currentSortField === 'created_at'
    },

    showUpdatedAt () {
      return this.has.updated_at && this.currentSortField === 'updated_at'
    }
  },

  methods: {
    sortOrderChanged (sortOrder) {
      this.currentSortFunction = sortOrder.sortFunction
      this.currentSortOrder = sortOrder.sortOrder
      this.currentSortField = sortOrder.sortField
      this.initSortedItems()
    },

    keywordChanged (keyword) {
      this.searchKeyword = keyword
      this.initSortedItems()
    },

    filterChanged () {
      this.initSortedItems()
    },

    initSortedItems () {
      let items = this.has.facetFilter ? this.filteredEntries : this.items

      if (!items.length && !this.sortedItems.length) {
        return
      }

      if (this.initSortedItemsNext) {
        return
      }

      this.initSortedItemsNext = true

      this.$nextTick(() => {
        items = this.has.facetFilter ? this.filteredEntries : this.items
        // console.log('################### FILTER ALL', this.has.facetFilter, this.filteredEntries.length, this.items.length, items.length)
        items = items.filter(i => {
          const title = replaceUmlauts(i.title.toLowerCase())
          const keyword = replaceUmlauts(this.searchKeyword.toLowerCase())
          return title.includes(keyword)
        })

        if (this.currentSortFunction) {
          items = this.currentSortFunction(items, this.currentSortOrder)
          if (this.currentSortFunction === sortByTitle) {
            if (this.searchKeyword) {
              items = sortByKeyword(items, this.searchKeyword)
            }
          }
        }

        this.currentNumItems = items.length // eslint-disable-line vue/no-side-effects-in-computed-properties
        if (this.limit) {
          items = items.slice(0, this.limit)
        }
        const pageNumber = Math.min(Math.max(1, this.currentPage), Math.ceil(items.length / this.currentPageSize))
        const index = (pageNumber - 1) * this.currentPageSize
        items = items.slice(index, index + this.currentPageSize)
        this.sortedItems = items
        this.loadVisibleEntries()

        this.initSortedItemsNext = false
      })
    },

    loadVisibleEntries () {
      if (!this.lazyLoad) {
        return
      }

      const idsByType = {}
      this.sortedItems.forEach(item => {
        if (!idsByType[item.type]) {
          idsByType[item.type] = {
            Query: item.class.Query,
            ids: []
          }
        }
        idsByType[item.type].ids.push(item.id)
      })

      Object.keys(idsByType).forEach(type => {
        const Query = idsByType[type].Query
        const ids = idsByType[type].ids
        while (ids.length) {
          const currentIds = ids.splice(0, 15)
          setTimeout(() => {
            Query.getAll({ids: currentIds})
          }, 100)
        }
      })
    },

    dayOfEvent (item) {
      let day = moment(item.date_start).date()
      if (day < 10) {
        day = '0' + day
      }
      return day
    },

    monthOfEvent (item) {
      return moment(item.date_start).format('MMM')
    },

    yearOfEvent (item) {
      const currentYear = moment().year().toString()
      const yearOfEvent = moment(item.date_start).format('YYYY')
      return currentYear === yearOfEvent ? null : yearOfEvent.substring(0, 4)
    },

    initPageProperties () {
      this.currentPage = this.$route.query.page || 1
      this.currentPageSize = this.$route.query.pageSize || 15
      this.initSortedItems()
    },

    setPage (config) {
      this.currentPage = config.page
      this.currentPageSize = config.pageSize
      if (this.modifyRoute) {
        const query = {...this.$route.query}
        if (config.page === 1) {
          delete query.page
        } else {
          query.page = config.page
        }
        if (config.pageSize === 15) {
          delete query.pageSize
        } else {
          query.pageSize = config.pageSize
        }
        this.$router.push({query: query})
      }
      this.initSortedItems()
    },

    routerLinkObject (item) {
      return {name: item.type + `.${this.has.linkToItem}`, params: {id: item.id}}
    }
  },

  components: {
    Pagination,
    Spinner,
    AnnotationTag,
    EditableEntryFacetItems,
    EntryOwners,
    EditableEntryNavigationItems,
    EntryMainFacetItems,
    FilterBar
  }
}
</script>

<style lang="scss" scoped>

.filterBar {
  margin-bottom: .4em;
  padding-bottom: .8em;
  border-bottom: 1px solid $gray20;
}

.paginationTop {
  &:not(.empty) {
    margin-bottom: 1.5em;
  }
}

.entryList {
  padding-left: 0;
  margin: 0;
  list-style: none;

  li {
    border-bottom: 1px solid $gray20;
    display: flex;
    align-items: center;
    padding-top: 1.5em;
    padding-bottom: 1.5em;
    padding-right: 4em;
  }

  li:last-child {
    border-bottom: none;
  }

  &__nav {
    cursor: pointer;
    color: inherit;
    display: flex;
    align-items: flex-end;
    word-break: break-word;
    hyphens: auto;
    .title {
      font-size: 1.4em;
      margin: 0;
      font-weight: 500;
      line-height: 120%;
      display: inline-block;
    }
  }

  &__date {
    margin-bottom: .5em;
  }

  .annotations {
    margin-top: .5em;
    .annotation {
      &:not(:first-child) {
        margin-top: .2em;
      }

      .entryIcon {
        margin-left: -8px;
        flex: 0 0 10px;
      }

      .details {
        flex-grow: 2;
        margin-top: .2em;
      }

      .category {
        font-size: .9em;
      }

      .detail {
        font-size: .9em;
      }

      .moreAnnotations {
        font-size: .9em;
        color: $gray30;
        white-space: nowrap;
        margin-left: .1em;
      }

      .entryList__status {
        margin-top: .5em;
      }
    }
  }

  .entryListItemOwners {
    margin-top: .2em;
  }

  .editableEntryFacetItems {
    margin-top: .8em;
    &.empty {
      margin-top: .3em;
    }
  }

  .entryNavigationItems {
    margin-top: .5em;
    &.empty {
      margin-top: .3em;
    }
  }

  &__numbers {
    > * {
      display: inline-block;
    }

    > *:first-child {
      margin-top: .6em;
    }

    > *:not(:last-child):after {
      content: ',';
    }
  }

  &__status {
    margin-top: .4em;
    font-size: .9em;
  }

  &__visual {
    flex: 0 0 80px;
    margin-right: 20px;
  }

  .entryType {
    display: none;
    font-size: .8em;
    text-transform: uppercase;
    margin-top: .2em;
    margin-bottom: 1em;
  }

  &__icon {
    text-align: center;
    .eventDate {
      text-align: center;
      margin-top: .4em;
      .day {
        font-size: 20px;
        line-height: 1em;
      }
      .month {
        font-size: 12px;
      }
      .year {
        color: $gray50;
        font-size: 10px;
      }
    }
  }

  &__attributes {
    align-items: baseline;
    font-size: 1em;
    color: $gray90;
  }

  &--lightColor {
    color: $gray50;
  }
}
</style>
