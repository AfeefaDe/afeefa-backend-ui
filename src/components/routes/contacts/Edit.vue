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
import OfferRouteConfig from '@/components/routes/offers/OfferRouteConfig'

import ContactEdit from '@/components/contact/ContactEdit'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id', 'contactId'],

  data () {
    let routeConfig = null
    if (this.$route.name.startsWith('events')) {
      routeConfig = new EventRouteConfig(this, this.id)
    } else if (this.$route.name.startsWith('orgas')) {
      routeConfig = new OrgaRouteConfig(this, this.id)
    } else if (this.$route.name.startsWith('offers')) {
      routeConfig = new OfferRouteConfig(this, this.id)
    }

    return {
      routeConfig
    }
  },

  components: {
    ContactEdit
  }
}
</script>
