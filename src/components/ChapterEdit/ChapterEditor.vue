<template>
  <div class="inputField__spacing input-field">
    <textarea v-model="value" :id="textareaID" class="materialize-textarea"></textarea>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'

import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'

export default {
  data: function () {
    return {
      textareaID: 'description'
    }
  },
  props: {
    value: {
      default: ''
    },
    toolbar1: {
      default: 'formatselect | bold italic strikethrough forecolor backcolor | bullist numlist | link  unlink | alignleft aligncenter alignright alignjustify | removeformat'
    },
    otherProps: {
      default: ''
    }
  },
  mounted () {
    // inspired by https://github.com/mbouclas/tinymce-vue-2
    tinymce.init({
      selector: `#${this.textareaID}`,
      skin: false,
      height: '450',
      plugins: ['link', 'lists'],
      toolbar1: this.toolbar1,
      menubar: '',
      content_css: [],
      init_instance_callback: (editor) => {
        editor.on('KeyUp', (e) => {
          this.$emit('input', editor.getContent())
        })
        editor.on('Change', (e) => {
          this.$emit('input', editor.getContent())
        })
        editor.setContent(this.value)
      },
      ...this.otherProps
    })
  },
  destroyed () {
    tinymce.get(this.textareaID).destroy()
  }
}
</script>

