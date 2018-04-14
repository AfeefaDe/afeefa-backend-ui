<template>
  <section class="footer">
    <button class="btn waves-effect waves-light red" @click.prevent="remove" v-if="item.id && has.remove">
      <i class="material-icons left">delete</i>
      Löschen
    </button>
    <div v-else></div>
    <div>
      <button class="btn waves-effect waves-light gray" @click.prevent="cancel" v-if="has.cancel">
        Abbrechen
      </button>
      <button class="btn waves-effect waves-light green" @click.prevent="save">
        <i class="material-icons left">done</i>
        {{ item.id ? 'Speichern' : 'Anlegen' }}
      </button>
    </div>
  </section>
</template>


<script>
export default {
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

    cancel () {
      this.$emit('cancel')
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
  button + button {
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
