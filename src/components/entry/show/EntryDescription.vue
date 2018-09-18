<template>
  <entry-detail-section
    :title="$t('entries.description')"
    icon="format_align_left"
    :editLink="{name: entry.type + '.edit', params: {id: entry.id}}">

    <p v-if="entry.short_description">{{ entry.short_description }}</p>

    <div v-if="entry.description">
      <entry-detail-property title="Lange Beschreibung">
        <p>{{ entry.description }}</p>
      </entry-detail-property>
    </div>
  </entry-detail-section>
</template>

<script>
export default {
  props: ['entry']
}
</script>
