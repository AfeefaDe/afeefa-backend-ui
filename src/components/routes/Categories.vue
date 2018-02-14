<template>
  <div>
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Kategorien</h2>
        </div>
        <div>
          <div v-for="parentCategory in categories" :key="parentCategory.id">
            <h4>{{ $t('categories.' + parentCategory.title) }}</h4>
            <ul class="browser-default">
              <li v-for="subCategory in parentCategory.sub_categories" :key="subCategory.id">{{ $t('categories.' + subCategory.title) }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Category from '@/models/Category'

export default {
  data () {
    return {
      categories: []
    }
  },

  created () {
    Category.getAll().then(categories => {
      this.categories = categories.filter(
        c => c.parent_category === null
      )
    })
  }
}
</script>

<style>
ul {
  padding-left: 20px;
}
li {
  list-style-type: circle;
}
</style>
