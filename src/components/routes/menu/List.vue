<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Navigation</h2>
        </div>

        <div>
          <ul>
            <li v-for="menuItem in menuItems" :key="menuItem.id">
              <div>
                <span class="menuItem">
                  {{ menuItem.id }} {{ $t('categories.' + menuItem.title) }} ({{ menuItem.count_owners }})
                </span>
                <ul>
                  <li v-for="subItem in menuItem.sub_items" :key="subItem.id">
                    <span class="menuItem">
                      {{ subItem.id }} {{ $t('categories.' + subItem.title) }} ({{ subItem.count_owners }})
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
import MenuItem from '@/models/MenuItem'

export default {
  data () {
    return {
      menuItems: []
    }
  },

  created () {
    this.loadMenuItems()
  },

  methods: {
    loadMenuItems () {
      MenuItem.Query.getAll().then(menuItems => {
        this.menuItems = menuItems
      })
    }
  }
}
</script>

<style lang="scss" scoped>
ul ul {
  padding-left: 20px;
}

.menuItem {
  background-color: rgba($gray50, 1);
  color: $white;

  display: inline-block;
  padding: 0 6px;
  margin: 2px 0;
  border-radius: 4px;
}</style>
