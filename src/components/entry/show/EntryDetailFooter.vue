<template>
  <div>
  <div class="entryDetailFooter">
    <div class="entryDetailFooter__item">
      <span class="label">{{ $t('entries.updated_at') }}:</span>
      <div class="content">
        <b>{{ entry.updated_at | formatDateRelative }}</b>
        ({{ entry.updated_at | formatDateAbsolute }})
        <span class="editor" v-if="entry.last_editor">
            von {{ entry.last_editor.name }}
            <span v-if="entry.last_editor.organization"> ({{ entry.last_editor.organization }})</span>
        </span>
      </div>
    </div>
    <div class="entryDetailFooter__item">
      <span class="label">{{ $t('entries.created_at') }}:</span>
      <div class="content">
        <b>{{ entry.created_at | formatDateRelative }}</b>
        ({{ entry.created_at | formatDateAbsolute }})
        <span class="editor" v-if="entry.creator">
          von {{ entry.creator.name }}
          <span v-if="entry.creator.organization"> ({{ entry.creator.organization }})</span>
        </span>
     </div>
    </div>
  </div>
</div>
</template>

<script>
import EntryDetailProperty from './EntryDetailProperty'

export default {
  props: ['entry'],
  components: {
    EntryDetailProperty
  }
}
</script>

<style lang="scss" scoped>
.entryDetailFooter {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  &__item {
    margin: 1em 1em;
    @media screen and (max-width: $break-medium) {
      margin: 1em 0;
    }
    display: flex;
    .label {
      color: $gray50;
      margin-right: 0.5em;
    }
    .editor {
      display: block;
    }
  }
}

</style>
