<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">{{ $t('status.all') }} {{ messages.headline() }} ({{ numItems }})</h2>
          <router-link v-if="addEntryButton" :to="{name: addEntryButton}"  class="mainCard__headerButton">
            {{$t('buttons.add')}}
            <i class="material-icons">add</i>
          </router-link>
        </div>

        <div v-if="type === 'events'" class="past-events-checkbox">
          <input class="filled-in" type="checkbox" id="pastEventFilter" v-on:click="updateCheckbox" value="false" v-model="showPastEvents">
          <label for="pastEventFilter">{{ $t('checkboxes.show_past_events') }}</label>
        </div>

        <entry-list-items
          :items="items"
          :sort-function="sortFunction"
          :options="options"
          :sortOrder="sortOrder">
        </entry-list-items>
      </div>
    </div>
  </div>
</template>


<script>
import EntryListItems from '@/components/EntryListItems'

export default {
  props: ['items', 'sortFunction', 'options', 'messages', 'addEntryButton', 'type'],

  data () {
    return {
      showPastEvents: false,
      sortOrder: 'ASC'
    }
  },

  computed: {
    numItems () {
      return this.items ? this.items.length : 0
    }
  },

  methods: {
    updateCheckbox () {
      if (this.showPastEvents === true) {
        this.$emit('input', {'filter[date]': 'past'})   // show past events
        this.sortOrder = 'DESC'
      } else {
        this.$emit('input', {'filter[date]': 'upcoming'})   // show upcoming events
        this.sortOrder = 'ASC'
      }
    }
  },

  components: {
    EntryListItems
  }
}
</script>

<style lang="scss" scoped>
.past-events-checkbox {
  display: flex;
  justify-content: flex-end;
}
</style>
