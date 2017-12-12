<template>
  <edit-form ref="form" :id="id"></edit-form>
</template>

<script>
import EditForm from './EditForm'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'

export default {
  props: ['id'],

  mixins: [BeforeRouteLeaveMixin],

  components: {
    EditForm
  }
}
</script>
