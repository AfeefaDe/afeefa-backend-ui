<template>
  <div class="inputField__spacing input-field">
    <h2>{{ $tc("entries.tags", 2) }}</h2>
    <div class="input-field">
      <tags-select-input @input="tagsChanged" :entryValue='item.tags'></tags-select-input>
    </div>
    <span class="validation-hint">
      <i class="material-icons">error_outline</i>
      Tags können mehrere Orgas und Veranstaltungen gruppieren.
    </span>
  </div>
</template>

<script>
import TagsSelectInput from './TagsSelectInput'

export default {
  props: ['item'],

  data () {
    return {
    }
  },

  created () {
  },

  methods: {
    tagsChanged (newTags) {
      this.item.tags = newTags
    }
  },

  components: {
    TagsSelectInput
  }
}
</script>
