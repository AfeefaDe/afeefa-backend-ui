<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard">
      <div class="mainCard__header">
        <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>
        <h2 class="mainCard__headerTitle">{{ currentArea }}</h2>
      </div>

      <div>
        <ul>
          <li v-for="category in categories" :key="category.id">
            <div>
              <span :class="['category', categoryClass(category)]">
                {{ category.id }} {{ $t('categories.' + category.title) }} ({{ category.count_owners }})
              </span>
              <ul>
                <li v-for="subCategory in category.sub_categories" :key="subCategory.id">
                  <span :class="['category', categoryClass(category)]">
                    {{ subCategory.id }} {{ $t('categories.' + subCategory.title) }} ({{ subCategory.count_owners }})
                  </span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </div>
</div>
</template>


<script>
import Category from '@/models/Category'

export default {
  props: ['area'],

  data () {
    return {
      currentArea: null,
      categories: []
    }
  },

  beforeRouteUpdate (to, from, next) {
    this.currentArea = to.params.area
    this.initCategories()
    next()
  },

  created () {
    this.currentArea = this.area
    this.initCategories()
  },

  methods: {
    initCategories (area) {
      Category.Query.with('sub_categories').getAll({area: this.currentArea}).then(categories => {
        this.categories = categories.filter(c => c.parent_category === null)
      })
    },

    goBack () {
      this.$router.go(-1)
    },

    categoryClass (category) {
      return 'cat-' + category.title
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/category-colors.scss';

.mainCard__headerTitle {
  text-transform: capitalize;
}

ul ul {
  padding-left: 20px;
}

.category {
  background-color: rgba($gray50, 1);
  color: $white;

  @include categoryColors($alpha_background: 1, $alpha_border: 0);

  display: inline-block;
  padding: 0 6px;
  margin: 2px 0;
  border-radius: 4px;
}
</style>
