<template>
  <div class="customMultiselect customMultiselect--border">
    <multiselect
      v-model="chosenTags"
      :options="possibleTags"
      :searchable="false"
      :allow-empty="true"
      :multiple="true"
      :close-on-select="true"
      @input="chosenTagsChanged"

      :placeholder="$t('multiselect.addTag')"
      :selectLabel="$t('multiselect.selectLabel')"
      :selectedLabel="$t('multiselect.selectedLabel')"
      :deselectLabel="$t('multiselect.deselectLabel')"
      >
      <span slot="noResult">{{$t('multiselect.noResult')}}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  props: ['entryValue'],
  components: {
    Multiselect
  },
  data () {
    return {
      chosenTags: [],
      possibleTags: ['asylum', 'homework', 'racism', 'youth']
    }
  },
  /*
   * setup for existing values: split string by ','
   */
  created () {
    if (this.entryValue && this.entryValue.split(',')) {
      this.chosenTags = this.entryValue.split(',')
    }
  },
  methods: {
    chosenTagsChanged () {
      this.$emit('input', this.chosenTags.join(','))
    }
  }
}
</script>
