<template>
  <div>
    <compact-entry-list :entries="entry.offers" :pageSize="5">
      <div slot="view" slot-scope="props" :class="['item', { first: !props.index }]">
        <div class="title">
          <router-link :to="{name: 'offers.show', params: {id: props.entry.id}}" class="entryList__nav">
            {{ props.entry.title }}
            ({{ offer.active ? 'aktiviert' : 'nicht aktiviert'}})
          </router-link>
        </div>
      </div>
    </compact-entry-list>

  </div>
</template>

<script>
import CompactEntryList from '@/components/entry/list/CompactEntryList'

export default {
  props: ['entry'],

  components: {
    CompactEntryList
  }
}
</script>
