<template>
  <div>
    <compact-entry-list :entries="entry.past_events" :pageSize="5">
      <div slot="view" slot-scope="props" :class="['item', { first: !props.index }]">
        <div class="date">
          {{props.entry | formatEventDate}}
          <span>({{props.entry.date_start | formatDateRelative(($i18n.locale))}})</span>
        </div>
        <div class="title">
          <router-link :to="{name: 'events.show', params: {id: props.entry.id}}" class="entryList__nav">
            {{ props.entry.title }}
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

<style lang="scss" scoped>
.date {
  font-size: .9em;
  color: $gray50;
  margin-bottom: .2em;
}
</style>
