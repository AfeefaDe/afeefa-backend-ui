<template>
  <section class="footer">
    <button class="btn waves-effect waves-light red" @click.prevent="remove" v-if="item.id && has.remove">
      <i class="material-icons left">delete</i>
      Löschen
    </button>
    <div v-else></div>
    <div>
      <router-link :to="{name: this.routeName + '.show', params: {id: item.id}}" class="btn waves-effect waves-light gray" v-if="has.cancel && item.id">
        <i class="material-icons left">cancel</i>
        {{ $t('buttons.cancel') }}
      </router-link>

      <router-link :to="{name: this.routeName + '.list'}" class="btn waves-effect waves-light gray" v-else-if="has.cancel && !item.id">
        <i class="material-icons left">cancel</i>
        {{ $t('buttons.cancel') }}
      </router-link>

      <button class="btn waves-effect waves-light green" @click.prevent="save">
        <i class="material-icons left">done</i>
        {{ item.id ? 'Speichern' : 'Anlegen' }}
      </button>
    </div>
  </section>
</template>


<script>
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['item', 'hasCancel', 'hasRemove'],

  data () {
    return {
      has: {
        cancel: this.hasCancel === undefined ? true : this.hasCancel,
        remove: this.hasRemove === undefined ? true : this.hasRemove
      }
    }
  },

  methods: {
    remove () {
      this.$emit('remove')
    },

    save () {
      this.$emit('save')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 1.2em;
  display: flex;
  justify-content: space-between;
  .btn + .btn {
    margin-left: .6em;
  }
  @media screen and (max-width: $break-small) {
    flex-wrap: wrap;
    button {
      flex-grow: 2;
      margin-bottom: 1.5em;
    }
  }
}
</style>
