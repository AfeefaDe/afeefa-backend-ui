<template>
  <afeefa-page>

    <afeefa-header slot="header">
      <div slot="title">
        Alle {{ $tc('offers.offer', 2) }} ({{ offers && offers.length || 0 }})
      </div>

      <div slot="buttons" v-if="offers">
        <router-link :to="{name: 'offers.new'}" class="btn btn-medium green">
          <i class="material-icons left">add</i>
          {{$t('buttons.add')}}
        </router-link>
      </div>
    </afeefa-header>

    <div slot="content">
      <entry-list-items
        :items="offers"
        :options="{filter: true, pagination: true, hideTypeIcon: false}" />
    </div>
  </afeefa-page>
</template>


<script>
import EntryListItems from '@/components/entry/EntryListItems'
import Offer from '@/models/Offer'

export default {
  data () {
    return {
      offers: null
    }
  },

  created () {
    Offer.Query.getAll().then(offers => {
      this.offers = offers
    })
  },

  components: {
    EntryListItems
  }
}
</script>
