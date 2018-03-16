<template>
  <div class="textAttribute">
      <label class="textAttribute__label" :for="fieldName">
        <span>{{ name }}</span>
        <span class="textAttribute__hint" v-if="maxChar && isEditing"> ({{value.length}}/{{maxChar}})</span>
      </label>
      <div :class="['textAttribute__container']">
        <i :class="['material-icons', 'icon', {editing: isEditing}]" v-on:click="startEditing">edit</i>
        <div class="textAttribute__inputContainer">
          <input
          type="text"
          :id="fieldName"
          :name="fieldName"
          :class="['browser-default', 'input', {'input--error': errors.has(fieldName) }, {editing: isEditing}, {dirty: isDirty}]"
          ref="editable"

          v-model="value"
          v-on:focus="focusElement"
          v-on:blur="blurElement"

          data-vv-validate-on="input|blur"
          v-validate.initial="validate"
          :data-vv-as="name"

          @keyup.enter="save"/>
          <span v-show="errors.has(fieldName)" class="validation-error">{{ errors.first(fieldName) }}</span>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: ['attribute', 'name', 'isMultiline', 'maxChar', 'validate', 'fieldName'],
  inject: ['$validator'],
  data () {
    return {
      isEditing: false,
      isDirty: false,
      value: ''
    }
  },
  created () {
    this.value = this.attribute
  },
  watch: {
    attribute () {
      this.value = this.attribute
    },
    value () {
      this.isDirty = !(this.value === this.attribute)
      console.log(this.isDirty)
    }
  },
  methods: {
    startEditing () {
      this.$nextTick(() => this.$refs.editable.focus())
    },
    focusElement () {
      this.isEditing = true
    },
    blurElement () {
      this.isEditing = false
      if (this.isDirty) {
        this.save()
      }
    },
    save () {
      console.log(this.errors.has(this.fieldName))
      if (this.isDirty && !this.errors.has(this.fieldName)) {
        this.$emit('save')
        console.log('@todo: save action')
        // simulate save; the save action should be propagated to the parent wich passes a new attribute prop down
        this.attribute = this.value
        this.isDirty = false
        this.$nextTick(() => this.$refs.editable.blur())
        // reset sate for failed navigation
      } else {
        this.value = this.attribute
        this.isDirty = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.textAttribute {
  margin: 2em 0;
  &__label {
    text-transform: uppercase;
    font-size: 1rem;
    color: $gray50;
    margin: 0;
    display: flex;
    justify-content: space-between;
  }
  &__hint {
    font-size: 0.8em;
  }
  &__inputContainer {
    width: 100%;
  }
  &__container {
    display: flex;
    align-items: baseline;
    transition: all 0.3s ease;
    .input {
        padding: 0.5em 0.2em;
        line-height: 160%;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        outline: 0;
        border: 0;
        border-bottom: 2px solid transparent;
        transition: border-bottom-color 0.4s ease;
        /* hover state */
        &:hover {
          border-bottom-color: $gray50;
        }
        &--error {
          border-bottom-color: $red!important;
        }
        &.editing {
          border-bottom-color: $green;
        }
        &.dirty {
          border-bottom-color: $yellow;
        }
    }
    .icon {
      font-size: 1.1rem;
      padding: 0 0.2em;
      color: $gray50;
      cursor: pointer;
      &.editing {
        color: inherit;
      }
    }
  }
}
</style>
