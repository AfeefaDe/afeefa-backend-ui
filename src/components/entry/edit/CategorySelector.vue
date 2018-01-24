<template>
  <div>
    <div class="inputField__spacing">
      <label for="category">Kategorie</label>
      <select
        v-model="item.category"
        id="category"
        name="category"
        @change="categoryChanged"
        data-vv-validate-on="change"
        :data-vv-as="$t('entries.category')"
        v-validate.initial="'required'"
        :class="['browser-default', {'validation-error': errors.has('category') }]">

        <option :value="null">Keine Kategorie ausgewählt</option>
        <option :value="category" v-for="category in categories" :key="category.id">
          {{ $t('categories.' + category.title) }}
        </option>
      </select>
      <span v-show="errors.has('category')" class="validation-error">{{ errors.first('category') }}</span>
    </div>

    <div class="inputField__spacing inputField__indented"
      v-if="item.category && item.category.sub_categories && item.category.sub_categories.length">
      <label>Unterkategorie</label>
      <select class="browser-default" v-model="item.sub_category">
        <option selected :value="null">Keine Kategorie ausgewählt</option>
        <option selected :value="category" v-for="category in item.category.sub_categories" :key="category.id">{{ $t('categories.' + category.title) }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Categories from '@/resources/Categories'

export default {
  props: ['item'],

  inject: ['$validator'],

  data () {
    return {
      categories: []
    }
  },

  created () {
    Categories.getAll().then(categories => {
      this.categories = categories.filter(
        c => c.parent_category === null
      )
    })
  },

  watch: {
    // https://github.com/baianat/vee-validate/issues/923
    // apparently vee-validate does not revalidate if our
    // item.category is initially null and loaded afterwards
    // so we have to revalidate manually
    'item.category' () {
      Vue.nextTick(() => {
        this.$validator.validate()
      })
    }
  },

  methods: {
    categoryChanged () {
      this.item.sub_category = null
    }
  }
}
</script>
