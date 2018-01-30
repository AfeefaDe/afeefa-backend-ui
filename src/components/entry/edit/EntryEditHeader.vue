<template>
  <div :class="['mainCard__header', 'mainCard__headerCategories', categoryClass]" v-if="item">
    <a href="" @click.prevent="goBack"><i class="material-icons go-back">chevron_left</i></a>

    <div class="mainCard__headerTitle">
      <h2 class="mainCard__headerTitleHeading"> {{item.title || defaultTitle }}</h2>
      <span v-if="item.parent_orga" class="mainCard__headerSubtitle">
        <router-link :to="{name: item.parent_orga.type + '.show', params: {id: item.parent_orga.id}}">
          <u>{{ item.parent_orga.title }}</u>
        </router-link>
      </span>
    </div>

    <a href="" @click.prevent="cancel" class="mainCard__headerAction"><i class="material-icons">cancel</i></a>
  </div>
</template>

<script>
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['item'],

  computed: {
    categoryClass () {
      if (this.item.category && this.item.category.title) {
        return 'cat-' + this.item.category.title
      }
    },

    defaultTitle () {
      return this.item.id
        ? 'Kein Titel'
        : this.item.type === 'events'
          ? 'Neue Veranstaltung'
          : 'Neuer Akteur'
    }
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    },

    cancel () {
      if (this.item.id) {
        this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}})
      } else {
        this.$router.push({name: this.routeName + '.list'})
      }
    }
  }
}
</script>
