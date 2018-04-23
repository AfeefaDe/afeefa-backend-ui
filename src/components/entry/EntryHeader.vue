<template>
  <afeefa-header :isEdit="isEdit">
    <div slot="title" v-if="entry">
      {{ entry.title || $t('offers.newOffer') }}
    </div>
    <div slot="title" v-else>
      {{ routeConfig.messages.loadingItem() }}
    </div>

    <div slot="subTitle" class="owners" v-if="entry && owners.length">
      <entry-list-item-owners :items="owners"></entry-list-item-owners>
    </div>

    <div slot="buttons" v-if="entry">
      <slot name="buttons" />

      <router-link :to="{name: this.routeName + '.show', params: {id: entry.id}}" class="btn gray btn-medium" v-if="isEdit && entry.id">
        <i class="material-icons left">cancel</i>
        {{ $t('buttons.cancel') }}
      </router-link>

      <router-link :to="{name: this.routeName + '.list'}" class="btn gray btn-medium" v-else-if="isEdit && !entry.id">
        <i class="material-icons left">cancel</i>
        {{ $t('buttons.cancel') }}
      </router-link>

      <router-link :to="{name: this.routeName + '.edit', params: {id: entry.id}}" class="btn green btn-medium" v-if="!isEdit">
        <i class="material-icons left">mode_edit</i>
        {{ $t('buttons.edit') }}
      </router-link>
    </div>
  </afeefa-header>
</template>

<script>
import EntryListItemOwners from '@/components/entry/EntryListItemOwners'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['entry', 'isEdit', 'routeConfig'],

  computed: {
    owners () {
      return this.entryOwners(this.entry)
    }
  },

  components: {
    EntryListItemOwners
  }
}
</script>
