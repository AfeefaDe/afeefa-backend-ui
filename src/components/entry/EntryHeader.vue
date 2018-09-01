<template>
  <afeefa-header :isEdit="isEdit">
    <div slot="title" v-if="entry">
      {{ entry.title || messages.newItem() }}
    </div>
    <div slot="title" v-else>
      {{ messages.loadingItem() }}
    </div>

    <div slot="subTitle" class="owners" v-if="entry && owners.length">
      <entry-owners :items="owners"></entry-owners>
    </div>

    <div slot="buttons" v-if="entry">
      <slot name="buttons" />

      <router-link :to="{name: routeName + '.show', params: {id: entry.id}}" class="btn gray btn-medium" v-if="isEdit && entry.id">
        <i class="material-icons left">cancel</i>
        {{ $t('buttons.cancel') }}
      </router-link>

      <router-link :to="cancelAddUrl" class="btn gray btn-medium" v-else-if="isEdit && !entry.id">
        <i class="material-icons left">cancel</i>
        {{ $t('buttons.cancel') }}
      </router-link>

      <router-link :to="{name: routeName + '.edit', params: {id: entry.id}}" class="btn green btn-medium" v-if="!isEdit">
        <i class="material-icons left">mode_edit</i>
        {{ $t('buttons.edit') }}
      </router-link>
    </div>

    <div slot="secondaryButtons" v-if="entry">
      <slot name="secondaryButtons" />
    </div>
  </afeefa-header>
</template>

<script>
import EntryOwners from '@/components/actor/EntryOwners'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['entry', 'isEdit', 'routeConfig'],

  computed: {
    owners () {
      return this.entryOwners(this.entry)
    },

    cancelAddUrl () {
      if (this.$route.query.actorId) {
        return {name: 'orgas.show', params: {id: this.$route.query.actorId}}
      } else {
        return {name: this.routeName + '.list'}
      }
    }
  },

  components: {
    EntryOwners
  }
}
</script>
