import formatDateAbsolute from './format-date-absolute'
import formatDateRelative from './format-date-relative'
import formatEventDate from './format-event-date'

export default {
  install (Vue) {
    Vue.filter('formatDateAbsolute', formatDateAbsolute)
    Vue.filter('formatDateRelative', formatDateRelative)
    Vue.filter('formatEventDate', formatEventDate)
  }
}
