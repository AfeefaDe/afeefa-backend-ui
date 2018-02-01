<template>
  <contact-edit
    :id="id"
    contactId=""
    :routeConfig="routeConfig"
    ref="form" />
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OrgaRouteConfig from '@/components/routes/orgas/OrgaRouteConfig'

import ContactEdit from '@/components/contact/ContactEdit'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this, this.id)
    }
  },

  components: {
    ContactEdit
  }
}
</script>
