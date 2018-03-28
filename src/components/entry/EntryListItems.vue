<template>
  <div>
    <div v-if="!items" class="loadingInfo">
      <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Liste
    </div>

    <div v-if="items && items.length > 1 && has.filter" class="filter">
      <input
        type="text"
        placeholder="Tippen zum Filtern"
        v-model="searchKeyword"
        @keydown.esc.prevent="searchKeyword = ''" />
      <a v-if="searchKeyword" @click.prevent="searchKeyword = ''" href="">
        <i class="material-icons">cancel</i>
      </a>
    </div>

    <div v-if="items && has.pagination">
      <pagination
        :num-items="currentNumItems"
        :page-size="currentPageSize"
        :page="currentPage"
        @changed="setPage">
      </pagination>
    </div>

    <div>
      Auswahl: {{ selectedItems.length }}
      <div v-if="selectedItems.length">
        <div v-for="facet in facets" :key="facet.id" v-if="facet.owner_types.includes('Orga')">
          <h2>{{ facet.title }}</h2>
          <multi-facet-selector :owners="selectedItems" :facet="facet" />
        </div>
      </div>
    </div>

    <ul class="entryList">
      <li v-for="item in itemsSorted" :key="item.type + item.id">

        <div v-if="!showIcon">
          <div v-if="has.typeIcon" class="entryList__icon">
            <entry-icon :item="item" />
            <div class="eventDate" v-if="item.type === 'events'">
              <div class="day">{{ dayOfEvent(item) }}</div>
              <div class="month">{{ monthOfEvent(item) }}</div>
              <div class="year" v-if="yearOfEvent(item)">{{ yearOfEvent(item) }}</div>
            </div>
          </div>
          <input type="checkbox" class="filled-in" :id="'select' + item.id" @change="select(item)">
          <label :for="'select' + item.id"></label>
        </div>

        <div class="entryList__content">
          <div class="entryList__attributes" v-if="has.event_date && item.type === 'events'">
            <p class="item entryList--lightColor">
              {{item | formatEventDate}}
              <span>({{item.date_start | formatDateRelative}})</span>
            </p>
          </div>

          <router-link :to="routerLinkObject(item)" class="entryList__nav">
            <h4 class="title">{{ item.title || 'Kein Titel' }}</h4>
            <span class="icon"><i v-if="!showIcon" class="material-icons">navigate_next</i></span>
          </router-link>

          <span v-if="item.parent_orga">
            <router-link :to="{name: item.parent_orga.type + '.show', params: {id: item.parent_orga.id}}">
              <u>{{ item.parent_orga.title }}</u>
            </router-link>
          </span>

          <span v-if="item.type === 'offers'">
            <router-link :to="{name: 'orgas.show', params: {id: actor.id}}" v-for="actor in item.actors" :key="actor.id">
              <u>{{ actor.title }}</u>
            </router-link>
          </span>

          <div class="entryList__attributes">
            <p class="item category" v-if="item.category">
              {{ $t('categories.' + item.category.title) }}
              <span v-if="item.sub_category">
                <i class="material-icons">navigate_next</i>
                {{ $t('categories.' + item.sub_category.title) }}
              </span>
            </p>

            <div>
              <span v-for="facet in facets" :key="facet.id" v-if="item.facet_items">
                <span v-for="facetItem in getSelectedFacetItems(facet, item)" :key="facetItem.id">
                  <facet-item-tag :facetItem="facetItem" />
                </span>
              </span>
            </div>

            <annotation-tag v-if="has.annotations" v-for="annotation in item.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>

            <div>
              <span v-if="item.count_offers">{{ item.count_offers }} {{ $tc('offers.offer', item.count_offers) }} </span>
              <span v-if="item.count_events">{{ item.count_events }} Veranstaltungen </span>
              <span v-if="item.count_resource_items">{{ item.count_resource_items }} Ressourcen </span>
              <span v-if="item.count_projects">{{ item.count_projects }} Projekte </span>
              <span v-if="item.count_network_members">{{ item.count_network_members }} Mitglieder </span>
            </div>

            <p class="item entryList--lightColor" v-if="has.updated_at">
              {{ $t('status.changed') }}
              {{item.updated_at | formatDateAbsolute}}
              <span>({{item.updated_at | formatDateRelative}})</span>
              <span v-if="item.last_editor"><br>von {{ item.last_editor.name }} <span v-if="item.last_editor.organization">({{ item.last_editor.organization }})</span></span>
            </p>

            <p class="item entryList--lightColor" v-if="has.created_at">
              {{ $t('status.added') }}
              {{item.created_at | formatDateAbsolute}}
              <span>({{item.created_at | formatDateRelative}})</span>
              <span v-if="item.creator"><br>von {{ item.creator.name }} <span v-if="item.creator.organization">({{ item.creator.organization }})</span></span>
            </p>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="items && currentNumItems && has.pagination">
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
import Facet from '@/models/Facet'
import FacetItemTag from '@/components/facet/FacetItemTag'
import MultiFacetSelector from '@/components/facet/MultiFacetSelector'

export default {
  props: {items: {}, limit: {}, sortFunction: {}, sortOrder: {}, showIcon: {}, options: {}, modifyRoute: {default: true}},

  data () {
    const options = this.options || {}
    return {
      facets: [],
      currentPageSize: 15,
      currentPage: 1,
      currentNumItems: 0,
      searchKeyword: '',
      selectedItems: [],
      has: {
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

    Facet.Query.getAll().then(facets => {
      this.facets = facets
    })
  },

  watch: {
    '$route' () {
      this.initPageProperties()
    }
  },

  computed: {
    itemsSorted () {
      let items = this.items || []
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
    select (item) {
      if (this.selectedItems.includes(item)) {
        this.selectedItems = this.selectedItems.filter(si => si !== item)
      } else {
        this.selectedItems.push(item)
      }
    },

    getSelectedFacetItems (facet, item) {
      return facet.getAllFacetItems().filter(facetItem => {
        return item.facet_items.includes(facetItem)
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

    categoryClass (item) {
      if (item.category && item.category.title) {
        return 'cat-' + item.category.title
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
    FacetItemTag,
    MultiFacetSelector
  }
}
</script>

<style lang="scss" scoped>

.loadingInfo {
  margin-top: .8em;
}

.filter {
  position: relative;

  a {
    position: absolute;
    top: .5em;
    right: 0;
  }
}

.facetItemTag {
  display: inline-block;
  margin-right: .4em;
  margin-bottom: .4em;
}

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
      flex-grow: 2;
      font-size: 1.4em;
      margin: 0 0 0.2em;
      font-weight: 500;
      line-height: 120%;
    }
  }

  div + &__nav .title {
    margin-top: 0.2em;
  }

  &__content {
    flex-grow: 2;
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
    .category {
      font-size: 1.1em;
    }
    .item {
      margin: 0 1.5em 0 0;
      &.category {
        margin-bottom: .2em;
      }
    }
    .item i {
      vertical-align: middle;
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
