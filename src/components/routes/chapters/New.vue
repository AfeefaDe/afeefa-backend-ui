<template>
  <edit-form ref="form" :id="null"></edit-form>
</template>

<script>
import EditForm from './EditForm'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'

export default {
  mixins: [BeforeRouteLeaveMixin],

  components: {
    EditForm
  }
}
</script>
