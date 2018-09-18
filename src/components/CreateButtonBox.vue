<template>
  <div class="createButtonBox">
    <div class="emptyMessage">{{ emptyMessage }}</div>

    <component :is="selector" v-if="selector" @select="entrySelected">
      <button type="button" class="btn green btn-small">
        <i class="material-icons left">{{ buttonIcon }}</i>
        {{ buttonTitle }}
      </button>
    </component>

    <button v-else type="button" class="btn green btn-small" @click="$emit('action')">
      <i class="material-icons left">{{ buttonIcon }}</i>
      {{ buttonTitle }}
    </button>

    <div class="alternativeAction" v-if="alternativeAction">
      <a href="" @click.prevent="$emit('alternativeAction')" class="inlineEditLink">
        {{ alternativeActionTitle }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['entryType', 'action', 'alternativeAction', 'selector'],

  computed: {
    emptyMessage () {
      const noEntry = this.$t(this.entryType + '.no')
      return this.$t('hints.no_entry_created_yet').replace('[NO_ENTRY]', noEntry)
    },

    buttonTitle () {
      const entryName = this.$tc(this.entryType + '.name', 1)
      return this.$t('actions.' + (this.action || 'createEntry')).replace('[ENTRY]', entryName)
    },

    buttonIcon () {
      return this.action === 'createEntry' ? 'add' : 'search'
    },

    alternativeActionTitle () {
      const entryName = this.$tc(this.entryType + '.name', 1)
      return this.$t('actions.' + this.alternativeAction).replace('[ENTRY]', entryName)
    }
  },

  methods: {
    entrySelected (entry) {
      this.$emit('select', entry)
    }
  }
}
</script>

<style lang="scss" scoped>
.createButtonBox {
  .emptyMessage {
    margin-bottom: 1em;
    color: $gray50;
    font-size: .9em;
    &:first-letter {
      text-transform: uppercase;
    }
  }
}
.alternativeAction {
  > * {
    display: inline-block;
    margin-top: .6em;
  }
}
</style>
