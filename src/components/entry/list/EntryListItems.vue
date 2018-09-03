<template>
  <div v-if="isLoading" class="loadingInfo">
    <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Liste
  </div>

  <div v-else>
    <div class="navigation" v-if="items.length && (has.filter || has.facetFilter)">
      <selected-filters v-if="has.facetFilter" class="facetsFilter" />

      <div v-if="itemsUnsorted.length && has.filter" class="searchFilter">
        <div class="inputContainer">
          <input
            class="browser-default"
            type="text"
            placeholder="Tippen zum Filtern"
            v-model="searchKeyword"
            @keydown.esc.prevent="searchKeyword = ''" />
          <a v-if="searchKeyword" @click.prevent="searchKeyword = ''" href="">
            <i class="material-icons">cancel</i>
          </a>
        </div>
      </div>

      <filter-icons v-if="has.facetFilter" class="facetsFilterIcons" />
    </div>

    <div v-if="has.pagination" class="paginationTop">
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

            <div class="entryList__attributes" v-if="!has.annotations && item.facet_items">
              <editable-entry-facet-items v-if="has.facetFilter" :entry="item" :bus="bus" />
              <entry-main-facet-items :entry="item" v-else />

              <editable-entry-navigation-items :entry="item" v-if="has.facetFilter && navigationIsSelected" />
            </div>

            <div v-if="has.annotations" class="annotations">
              <div v-for="annotation in item.annotations.slice(0, 1)" :key="annotation.id" class="annotation">
                <!-- <entry-icon :item="annotation" /> -->
                <div class="details">
                  <span class="category">{{ annotation.annotationCategory.title}}:</span>
                  <span class="detail">{{ annotation.detail}}</span>
                  <span v-if="item.annotations.length > 1" class="moreAnnotations">
                    und {{ item.annotations.length - 1 }} weitere
                  </span>
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

            <div class="entryList__status entryList--lightColor" v-if="has.updated_at">
              {{ $t('status.changed') }}
              {{item.updated_at | formatDateAbsolute}}
              <span>({{item.updated_at | formatDateRelative}})</span>
              <span v-if="item.last_editor"> von {{ item.last_editor.name }} <span v-if="item.last_editor.organization">({{ item.last_editor.organization }})</span></span>
            </div>

            <div class="entryList__status entryList--lightColor" v-if="has.created_at">
              {{ $t('status.added') }}
              <!-- {{item.created_at | formatDateAbsolute}} -->
              <!-- <span>({{item.created_at | formatDateRelative}})</span> -->
              <span>{{item.created_at | formatDateRelative}}</span>
              <span v-if="item.creator"> von {{ item.creator.name }} <span v-if="item.creator.organization">({{ item.creator.organization }})</span></span>
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
import SelectedFilters from '@/components/entry/list/filterbar/SelectedFilters'
import FilterIcons from '@/components/entry/list/filterbar/FilterIcons'
import { mapState } from 'vuex'

export default {
  props: {
    items: {},
    lazyLoad: {default: false},
    isLoading: {},
    limit: {},
    sortFunction: {},
    sortOrder: {},
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
      bus: this,
      has: {
        facetFilter: options.facetFilter,
        filter: options.filter,
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
  },

  watch: {
    '$route' (newItems, oldItems) {
      this.initPageProperties()
    },

    'items' (newItems, oldItems) {
      this.searchKeyword = ''
      this.initSortedItems()
    },

    'searchKeyword' () {
      this.initSortedItems()
    },

    'filteredEntries' (newItems, oldItems) {
      if (oldItems.length) {
        this.searchKeyword = ''
        this.setPage({
          page: 1,
          pageSize: 15
        })
        this.initSortedItems()
      }
    }
  },

  computed: {
    ...mapState({
      filteredEntries: state => state.facetFilters.filteredEntries,
      navigationIsSelected: state => state.facetFilters.navigationIsSelected
    }),

    itemsUnsorted () {
      return this.has.facetFilter ? this.filteredEntries : this.items
    }
  },

  methods: {
    initSortedItems () {
      if (this.initSortedItemsNext) {
        return
      }
      this.initSortedItemsNext = true

      this.$nextTick(() => {
        let items = this.has.facetFilter ? this.filteredEntries : this.items
        items = items.filter(i => i.title.toLowerCase().includes(this.searchKeyword.toLowerCase()))
        items = this.sortFunction ? this.sortFunction(items, this.sortOrder) : items
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
        Query.getAll({ids: idsByType[type].ids})
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
    SelectedFilters,
    EditableEntryNavigationItems,
    EntryMainFacetItems,
    FilterIcons
  }
}
</script>

<style lang="scss" scoped>

.navigation {
  position: relative;
  margin-bottom: .4em;
  padding-bottom: .8em;
  border-bottom: 1px solid $gray20;
}

.facetsFilter {
  flex-grow: 2;
  margin-bottom: .4em;
  &.empty {
    margin-bottom: 0;
  }
}

.facetsFilterIcons {
  position: absolute;
  top: .2em;
  right: 0;
}

.searchFilter {
  .inputContainer {
    display: inline-block;
    position: relative;
  }

  input {
    padding-right: 2em;
    width: 200px;
  }

  a {
    position: absolute;
    top: .6em;
    right: .6em;
  }

  i {
    color: $gray80;
    font-size: 18px;
  }
}

.paginationTop {
  margin-bottom: 1.5em;
}

.entryList {
  padding-left: 0;
  margin-top: 0;
  list-style: none;

  li {
    border-bottom: 1px solid $gray20;
    display: flex;
    align-items: center;
    &:not(:first-child) {
      padding-top: 1em;
    }
    padding-bottom: 1em;
    padding-right: 1em;
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
    margin-top: .4em;
    .annotation {
      display: flex;
      align-items: top;

      &:not(:first-child) {
        margin-top: .2em;
      }
      &:not(:last-child) {
        margin-bottom: .2em;
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
