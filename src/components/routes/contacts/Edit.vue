<template>
  <contact-edit
    :id="id"
    :contactId="contactId"
    :routeConfig="routeConfig"
    ref="form" />
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OrgaRouteConfig from '@/components/routes/orgas/OrgaRouteConfig'
import EventRouteConfig from '@/components/routes/events/EventRouteConfig'

import ContactEdit from '@/components/contact/ContactEdit'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id', 'contactId'],

  data () {
    return {
      routeConfig: this.$route.name.startsWith('events')
        ? new EventRouteConfig(this, this.id)
        : new OrgaRouteConfig(this, this.id)
    }
  },

  components: {
    ContactEdit
  }
}
</script>
