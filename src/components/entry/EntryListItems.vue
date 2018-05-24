<template>
  <div v-if="isLoading" class="loadingInfo">
    <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Liste
  </div>

  <div v-else>
    <div class="navigation" v-if="has.filter || has.facetFilter || has.pagination">
      <entry-list-facet-filter v-if="has.facetFilter" :showFilters="true" class="facetsFilter" />

      <div v-if="itemsUnsorted.length && has.filter" class="searchFilter">
        <div class="inputContainer">
          <input
            type="text"
            placeholder="Tippen zum Filtern"
            v-model="searchKeyword"
            @keydown.esc.prevent="searchKeyword = ''" />
          <a v-if="searchKeyword" @click.prevent="searchKeyword = ''" href="">
            <i class="material-icons">cancel</i>
          </a>
        </div>
      </div>

      <entry-list-facet-filter v-if="has.facetFilter" :showFilterIcons="true" class="facetsFilterIcons" />
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
      <li v-for="item in itemsSorted" :key="item.type + item.id">

        <div>
          <div v-if="has.typeIcon" class="entryList__icon">
            <entry-icon :item="item" />
            <div class="eventDate" v-if="item.type === 'events'">
              <div class="day">{{ dayOfEvent(item) }}</div>
              <div class="month">{{ monthOfEvent(item) }}</div>
              <div class="year" v-if="yearOfEvent(item)">{{ yearOfEvent(item) }}</div>
            </div>
          </div>
        </div>

        <div class="entryList__content">
          <div class="entryList__attributes" v-if="has.event_date && item.type === 'events'">
            <div class="entryList__date entryList--lightColor">
              {{item | formatEventDate}}
              <span>({{item.date_start | formatDateRelative}})</span>
            </div>
          </div>

          <router-link :to="routerLinkObject(item)" class="entryList__nav">
            <h4 class="title">{{ item.title || 'Kein Titel' }}</h4>
          </router-link>

          <div v-if="item.type === 'orgas' && item.project_initiators.length">
            <entry-list-item-owners :items="item.project_initiators"></entry-list-item-owners>
          </div>

          <div v-if="item.type === 'offers' && item.owners.length">
            <entry-list-item-owners :items="item.owners"></entry-list-item-owners>
          </div>

          <div v-if="item.type === 'events' && item.hosts.length">
            <entry-list-item-owners :items="item.hosts"></entry-list-item-owners>
          </div>

          <div class="entryList__attributes" v-if="item.facet_items">
            <editable-entry-facets v-if="has.facetFilter" :entry="item" :bus="bus" />
            <entry-main-facet-items :entry="item" v-else />

            <entry-navigation-items :entry="item" v-if="has.facetFilter && navigationIsSelected" />

            <annotation-tag v-if="has.annotations" v-for="annotation in item.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>

            <div class="entryList__numbers">
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
              <span v-if="item.last_editor"><br>von {{ item.last_editor.name }} <span v-if="item.last_editor.organization">({{ item.last_editor.organization }})</span></span>
            </div>

            <div class="entryList__status entryList--lightColor" v-if="has.created_at">
              {{ $t('status.added') }}
              {{item.created_at | formatDateAbsolute}}
              <span>({{item.created_at | formatDateRelative}})</span>
              <span v-if="item.creator"><br>von {{ item.creator.name }} <span v-if="item.creator.organization">({{ item.creator.organization }})</span></span>
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
import EntryIcon from '@/components/entry/EntryIcon'
import Spinner from '@/components/Spinner'
import moment from 'moment'
import EditableEntryFacets from '@/components/entry/EditableEntryFacets'
import EntryMainFacetItems from '@/components/entry/EntryMainFacetItems'
import EntryNavigationItems from '@/components/entry/EntryNavigationItems'
import EntryListItemOwners from '@/components/entry/EntryListItemOwners'
import EntryListFacetFilter from '@/components/entry/EntryListFacetFilter'
import { mapState } from 'vuex'

export default {
  props: {
    items: {},
    isLoading: {},
    limit: {},
    sortFunction: {},
    sortOrder: {},
    options: {},
    navigationItemCountAttributeName: {},
    modifyRoute: {default: true}
  },

  data () {
    const options = this.options || {}
    return {
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
    '$route' () {
      this.initPageProperties()
    },

    'items' () {
      this.searchKeyword = ''
    },

    'filteredEntries' () {
      this.searchKeyword = ''
      this.setPage({
        page: 1,
        pageSize: 15
      })
    }
  },

  computed: {
    ...mapState({
      filteredEntries: state => state.facetFilters.filteredEntries,
      navigationIsSelected: state => state.facetFilters.navigationIsSelected
    }),

    itemsUnsorted () {
      return this.has.facetFilter ? this.filteredEntries : this.items
    },

    itemsSorted () {
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
      return items
    }
  },

  methods: {
    showNavigationItemsClick () {
      console.log('click')
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
    },

    setPage (config) {
      this.currentPage = config.page
      this.currentPageSize = config.pageSize
      if (this.modifyRoute) {
        const query = {...this.$route.query}
        query.page = config.page === 1 ? undefined : config.page
        query.pageSize = config.pageSize === 15 ? undefined : config.pageSize
        this.$router.push({query: query})
      }
    },

    routerLinkObject (item) {
      return {name: item.type + `.${this.has.linkToItem}`, params: {id: item.id}}
    }
  },

  components: {
    Pagination,
    Spinner,
    AnnotationTag,
    EntryIcon,
    EditableEntryFacets,
    EntryListItemOwners,
    EntryListFacetFilter,
    EntryNavigationItems,
    EntryMainFacetItems
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
    margin: 0;
    border: none !important;
    box-shadow: none !important;
    background-color: $white;
    padding: .4em;
    padding-right: 2em;
    width: 150px;
    height: auto;
  }

  a {
    position: absolute;
    top: .5em;
    right: .5em;
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
    padding: 1em 0;
    display: flex;
    align-items: flex-start;
  }

  li:last-child {
    border-bottom: none;
  }

  &__nav {
    cursor: pointer;
    color: inherit;
    // display: flex;
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

  &__icon {
    margin-right: 2em;
    margin-top: 0.3em;
    line-height: 100%;
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
