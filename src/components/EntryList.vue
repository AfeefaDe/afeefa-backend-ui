<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 v-if="type === 'events'" class="mainCard__headerTitle">
            <template v-if="showPastEvents === true">
              {{ $t('headlines.pastEvents') }} ({{ numItems }})
            </template>
            <template v-else>
              {{ $t('headlines.upcomingEvents') }} ({{ numItems }})
            </template>
          </h2>
          <h2 v-else class="mainCard__headerTitle">
            {{ $t('status.all') }} {{ messages.headline() }} ({{ numItems }})
          </h2>
          <router-link v-if="addEntryButton" :to="{name: addEntryButton}"  class="mainCard__headerButton">
            {{$t('buttons.add')}}
            <i class="material-icons">add</i>
          </router-link>
        </div>

        <entry-list-items
          :items="items"
          :sort-function="sortFunction"
          :options="options"
          :sortOrder="sortOrder">
        </entry-list-items>

        <div v-if="type === 'events'" class="past-events-checkbox">
          <br>
          <input class="filled-in" type="checkbox" id="pastEventFilter" v-on:click="updateCheckbox" value="false" v-model="showPastEvents">
          <label for="pastEventFilter">{{ $t('checkboxes.show_past_events') }}</label>
        </div>
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
      showPastEvents: null,
      sortOrder: 'ASC'
    }
  },

  computed: {
    numItems () {
      return this.items ? this.items.length : 0
    }
  },

  updated () {
    if (this.$route.query.filter === 'past') {
      this.showPastEvents = true
    } else {
      this.showPastEvents = false
    }
  },

  methods: {
    updateCheckbox () {
      this.$emit('input', this.showPastEvents)
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
