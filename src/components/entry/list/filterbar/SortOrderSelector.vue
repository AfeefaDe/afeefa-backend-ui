<template>
  <div class="sortOrderSelector">
    <select class="browser-default" v-model="selectedSortOrder" @change="change">
      <option v-for="sortOrder in sortOrders" :key="sortOrder.name" :value="sortOrder">
        {{ sortOrder.name }}
      </option>
    </select>
    <div class="orderIcon" @click="reverseSort">
      <i class="material-icons">{{ currentOrderDirection === 'ASC' ? 'arrow_downward' : 'arrow_upward' }}</i>
    </div>
  </div>
</template>

<script>
import sortByCreatedAt from '@/helpers/sort-by-created-at'
import sortByUpdatedAt from '@/helpers/sort-by-updated-at'
import sortByTitle from '@/helpers/sort-by-title'

export default {
  props: ['customSortOrders'],

  data () {
    return {
      selectedSortOrder: null,
      currentOrderDirection: 'ASC',
      sortOrders: [],
      defaultSortOrders: [
        { name: 'Erstellt', sort: sortByCreatedAt, order: 'DESC', field: 'created_at' },
        { name: 'Geändert', sort: sortByUpdatedAt, order: 'DESC', field: 'updated_at' },
        { name: 'A-Z', sort: sortByTitle, order: 'ASC' }
      ]
    }
  },

  created () {
    const customOrders = this.customSortOrders || []
    this.sortOrders = customOrders.concat(this.defaultSortOrders)
    this.selectedSortOrder = this.sortOrders[0]
    this.currentOrderDirection = this.selectedSortOrder.order
    this.emitChange()
  },

  methods: {
    reverseSort () {
      this.currentOrderDirection = this.currentOrderDirection === 'ASC' ? 'DESC' : 'ASC'
      this.emitChange()
    },

    change () {
      this.currentOrderDirection = this.selectedSortOrder.order
      this.emitChange()
    },

    emitChange () {
      this.$emit('change', {
        sortFunction: this.selectedSortOrder.sort,
        sortOrder: this.currentOrderDirection,
        sortField: this.selectedSortOrder.field
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sortOrderSelector {
  display: flex;
  align-items: center;

  select {
    width: auto;
  }
}

.orderIcon {
  @include user-select();
  width: 1.5em;
  height: 2em;
  margin-left: .2em;
  cursor: pointer;
  position: relative;
  color: $gray50;
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -60%);
  }
}

</style>
