<template>
  <div class="entryDetailFooter">
    <div class="content">
      {{ $t('status.changed') }}
      <b>{{ entry.updated_at | formatDateRelative(($i18n.locale)) }}</b>
      ({{ entry.updated_at | formatDateAbsolute }})
      <span class="editor" v-if="entry.last_editor">
          <br>von {{ entry.last_editor.name }}
          <span v-if="entry.last_editor.organization"> ({{ entry.last_editor.organization }})</span>
      </span>
    </div>
    <div class="content">
      {{ $t('status.added') }}
      <b>{{ entry.created_at | formatDateRelative(($i18n.locale)) }}</b>
      ({{ entry.created_at | formatDateAbsolute }})
      <span class="editor" v-if="entry.creator">
        <br>von {{ entry.creator.name }}
        <span v-if="entry.creator.organization"> ({{ entry.creator.organization }})</span>
      </span>
    </div>
  </div>
</template>


<script>
export default {
  props: ['entry']
}
</script>


<style lang="scss" scoped>
.entryDetailFooter {
  // background-color: white;
  // border: 1px solid $white;
  // box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.05);
  // padding: .5em;
  // display: inline-block;
  .content:last-child {
    margin-top: .5em;
  }
}

</style>
