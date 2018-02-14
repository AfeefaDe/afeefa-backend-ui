<template>
  <div class="inputField__spacing">
    <p v-if="item.parent_orga && item.inheritance.short_description" class="inheritance-output inheritedValue">
      {{item.parent_orga.short_description}}
    </p>

    <div class=" input-field">
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

    <div class="inheritance-field" v-if="item.parent_orga && item.parent_orga.short_description">
      <input class="filled-in" id="inheritDescription" type="checkbox" v-model="item.inheritance.short_description"/>
      <label for="inheritDescription">{{ $t('checkboxes.short_description_inheritance') }}</label>
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

<style lang="scss" scoped>
.inheritance-field {
  margin-top: .5em;
}

.inheritance-output {
  margin-bottom: 0;
  color: $gray50;
}
</style>
