<template>
  <div>
    <pagination
      :num-items="currentNumItems"
      :page-size="currentPageSize"
      :page="currentPage"
      @changed="setPage"
      v-if="has.pagination">
    </pagination>

    <ul class="entryList">
      <li v-for="item in itemsSorted">
        <div class="entryList__icon">
          <span :class="['entry-icon',  'entry-icon--' + item.type, 'entry-icon--' + (item.active ? 'active' : 'inactive')]"></span>
        </div>

        <div class="entryList__content">
          <router-link :to="{name: item.type + '.show', params: {id: item.id}}" class="entryList__nav">
            <h4 class="title">{{item.title}}</h4>
            <span class="icon"><i class="material-icons">navigate_next</i></span>
          </router-link>

          <div class="entryList__attributes">
            <p class="item category" v-if="item.category">
              {{item.category.title}}
              <span v-if="item.sub_category">
                <i class="material-icons">navigate_next</i>
                {{item.sub_category.title}}
              </span>
            </p>

            <p v-for="annotation in item.annotations"
              class="annotationTag"
              title="Durch das Bearbeiten des Eintrags können Anmerkungen entfernt und hinzugefügt werden."
              v-if="has.annotations">
              {{annotation.title}}
            </p>

            <p class="item entryList--lightColor" v-if="has.updated_at">
              {{ $t('status.changed') }}
              {{item.updated_at | formatDateRelative}}
              <span>({{item.updated_at | formatDateAbsolute}})</span>
            </p>

            <p class="item entryList--lightColor" v-if="has.date_start">
              {{ $t('status.time') }}
              {{item.date_start | formatDateRelative}}
              <span>({{item.date_start | formatDateAbsolute}})</span>
            </p>

            <p class="item entryList--lightColor" v-if="has.created_at">
              {{ $t('status.added') }}
              {{item.created_at | formatDateRelative}}
              <span>({{item.created_at | formatDateAbsolute}})</span>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
import Pagination from '@/components/Pagination'

export default {
  props: ['items', 'limit', 'sortFunction', 'options'],

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
        date_start: options.date_start,
        created_at: options.created_at
      }
    }
  },

  computed: {
    itemsSorted () {
      let items = this.sortFunction ? this.sortFunction(this.items) : this.items
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
    setPage (config) {
      this.currentPage = config.page
      this.currentPageSize = config.pageSize
    }
  },

  components: {
    Pagination
  }
}
</script>
