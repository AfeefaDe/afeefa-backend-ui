<template>
  <div class="inputField__spacing">
    <div class="input-field">
      <label for="short_description" :class="{active: item.short_description}">
        {{ $t('entries.short_description') }}
        <span class="labelCharacterCount" v-if="item.short_description.length">{{item.short_description.length}}/350</span>
      </label>

      <textarea
        v-model="item.short_description"
        id="short_description"
        name="short_description"
        :data-vv-as="$t('entries.short_description')"
        v-validate.initial="'required|max: 350'"
        :class="['materialize-textarea', {'validation-error': errors.has('short_description') }]"
        v-autosize>
      </textarea>
      <span v-show="errors.has('short_description')" class="validation-error">{{ errors.first('short_description') }}</span>
    </div>

    <div class="inputField__spacing input-field" v-if="has.description">
      <label for="description" :class="{active: item.description}">{{ $t('entries.description') }}</label>
      <textarea v-model="item.description" id="description"
        class="materialize-textarea" v-autosize></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item', 'options'],

  inject: ['$validator'],

  data () {
    const options = this.options || {}
    return {
      has: {
        description: options.description !== false
      }
    }
  }
}
</script>

