<template>
  <div class="mainCard">
    <div class="mainCard__header mainCard__headerLight">
      <span v-if="error">{{ messages.loadingItemError() }}</span>
      <span v-else>
        <spinner :show="true" :width="1" :radius="5" :length="3" /> {{ messages.loadingItem() }} ...
      </span>
    </div>
  </div>
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
