import formatDateAbsolute from './format-date-absolute'
import formatDateRelative from './format-date-relative'

export default {
  install (Vue) {
    Vue.filter('formatDateAbsolute', formatDateAbsolute)
    Vue.filter('formatDateRelative', formatDateRelative)
  }
}
