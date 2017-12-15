<template>
  <chapter-edit ref="form" :id="null"></chapter-edit>
</template>

<script>
import ChapterEdit from '@/components/ChapterEdit/ChapterEdit'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'

export default {
  mixins: [BeforeRouteLeaveMixin],

  components: {
    ChapterEdit
  }
}
</script>
