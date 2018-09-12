import Vue from 'vue'
import autosize from 'autosize'

Vue.directive('autosize', {
  inserted: function (el) {
    Vue.nextTick(() => {
      autosize(el)
    })
  }
})

Vue.directive('focus', {
  inserted: function (el, binding) {
    console.log(binding)
    if (binding.value === false) {
      return
    }
    const x = window.scrollX
    const y = window.scrollY
    el.focus()
    // prevent browser autoscrolling to focused input
    window.scrollTo(x, y)
  }
})

Vue.directive('select', {
  inserted: function (el) {
    el.select()
  }
})

Vue.directive('visible', function (el, binding) {
  el.style.visibility = binding.value ? 'visible' : 'hidden'
})
