import Vue from 'vue'
import autosize from 'autosize'

Vue.directive('autosize', {
  inserted: function (el) {
    Vue.nextTick(() => {
      autosize(el)
    })
  }
})
