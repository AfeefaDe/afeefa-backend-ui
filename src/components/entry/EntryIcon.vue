<template>
  <span :class="[
    'entryType-icon',
    'entryType-icon--' + item.type,
    'entryType-icon--' + (item.active ? 'active' : 'inactive'),
    'entryType-icon--categoryColors',
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
