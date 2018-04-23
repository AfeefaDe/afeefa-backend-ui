<template>
  <span v-if="error">{{ messages.loadingItemError() }}</span>
  <span v-else>
    <spinner :show="true" :width="1" :radius="5" :length="3" /> {{ messages.loadingItem() }} ...
  </span>
</template>

<script>
import Spinner from '@/components/Spinner'

export default {
  props: ['error', 'messages'],

  components: {
    Spinner
  }
}
</script>
