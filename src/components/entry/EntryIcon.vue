<template>
  <span :class="[
    'entryTypeIcon',
    'entryTypeIcon--' + item.type,
    'entryTypeIcon--' + (item.active ? 'active' : 'inactive'),
    'entryTypeIcon--categoryColors',
    categoryClass(item)
  ]">
  </span>
</template>

<script>
export default {
  props: ['item'],

  methods: {
    categoryClass (item) {
      if (item.category && item.category.title) {
        return 'cat-' + item.category.title
      }
    }
  }
}
</script>
