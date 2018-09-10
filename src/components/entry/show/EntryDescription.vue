<template>
  <entry-detail-section
    :title="$t('entries.description')"
    icon="format_align_left"
    :editLink="{name: entry.type + '.edit', params: {id: entry.id}}">

    <p v-if="entry.short_description">{{ entry.short_description }}</p>

    <div v-if="entry.description">
      <entry-detail-property2 title="Lange Beschreibung" :inlineEditing="['Anzeigen', 'Verstecken']">
        <p slot-scope="props" v-if="props.isEdit">{{ entry.description }}</p>
      </entry-detail-property2>
    </div>
  </entry-detail-section>
</template>

<script>
export default {
  props: ['entry']
}
</script>
