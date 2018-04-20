<template>
  <span :class="[
    'entryTypeIcon',
    'entryTypeIcon--' + item.type,
    'entryTypeIcon--' + (item.active ? 'active' : 'inactive')
  ]">
  </span>
</template>

<script>
export default {
  props: ['item']
}
</script>
