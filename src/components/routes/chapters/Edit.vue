<template>
  <chapter-edit ref="form" :id="id"></chapter-edit>
</template>

<script>
import ChapterEdit from '@/components/chapter/ChapterEdit'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'

export default {
  props: ['id'],

  mixins: [BeforeRouteLeaveMixin],

  components: {
    ChapterEdit
  }
}
</script>
